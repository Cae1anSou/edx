import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  createUpload,
  fetchGenerateVideoUploadLink,
  fetchTranscriptCredentials,
  fetchTranscriptPreferences,
  fetchUpload,
  fetchVideoEncodingsDownload,
  fetchVideoFeatures,
  fetchVideoImagesUploadEnabled
} from '../api/studio';

export function UploadsPage() {
  const location = useLocation();
  const params = useParams<{ courseKey?: string; edxVideoId?: string }>();
  const seededCourseKey = params.courseKey ? decodeURIComponent(params.courseKey) : '';

  const pathSeeds = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, '');
    const parseCourseLike = (segments: string[]) => {
      if (segments.length === 0) {
        return { courseId: '', remaining: [] as string[] };
      }
      if (segments[0].includes(':')) {
        return { courseId: decodeURIComponent(segments[0]), remaining: segments.slice(1) };
      }
      if (segments.length >= 3) {
        return { courseId: decodeURIComponent(segments.slice(0, 3).join('/')), remaining: segments.slice(3) };
      }
      return { courseId: decodeURIComponent(segments[0]), remaining: segments.slice(1) };
    };

    const coursePrefixes = [
      '/videos/',
      '/video_images/',
      '/generate_video_upload_link/',
      '/transcript_preferences/',
      '/transcript_credentials/',
      '/video_encodings_download/',
      '/transcript_delete/'
    ];
    for (const prefix of coursePrefixes) {
      if (pathname.startsWith(prefix)) {
        const segments = pathname.slice(prefix.length).split('/').filter(Boolean);
        const parsed = parseCourseLike(segments);
        return {
          courseId: parsed.courseId,
          videoId: parsed.remaining[0] ? decodeURIComponent(parsed.remaining[0]) : ''
        };
      }
    }
    return { courseId: '', videoId: '' };
  }, [location.pathname]);

  const [filename, setFilename] = useState(seededCourseKey ? `${seededCourseKey}.mp4` : 'intro.mp4');
  const [token, setToken] = useState(params.edxVideoId ? decodeURIComponent(params.edxVideoId) : '');
  const [courseIdInput, setCourseIdInput] = useState(seededCourseKey || 'course-v1:org+num+run');

  const createMutation = useMutation({
    mutationFn: createUpload,
    onSuccess: (result) => {
      const nextToken = result.upload.token;
      if (typeof nextToken === 'string') {
        setToken(nextToken);
      }
    }
  });

  const statusMutation = useMutation({ mutationFn: fetchUpload });
  const uploadLinkMutation = useMutation({ mutationFn: fetchGenerateVideoUploadLink });
  const transcriptPreferencesMutation = useMutation({ mutationFn: fetchTranscriptPreferences });
  const transcriptCredentialsMutation = useMutation({ mutationFn: fetchTranscriptCredentials });
  const videoEncodingsMutation = useMutation({ mutationFn: fetchVideoEncodingsDownload });
  const videoFeaturesMutation = useMutation({ mutationFn: fetchVideoFeatures });
  const videoImagesEnabledMutation = useMutation({ mutationFn: fetchVideoImagesUploadEnabled });

  useEffect(() => {
    if (pathSeeds.courseId) {
      setCourseIdInput(pathSeeds.courseId);
      setFilename(`${pathSeeds.courseId}.mp4`);
    }
    if (pathSeeds.videoId) {
      setToken(pathSeeds.videoId);
    }
  }, [pathSeeds]);

  const latestResponse =
    statusMutation.data ??
    createMutation.data ??
    uploadLinkMutation.data ??
    transcriptPreferencesMutation.data ??
    transcriptCredentialsMutation.data ??
    videoEncodingsMutation.data ??
    videoFeaturesMutation.data ??
    videoImagesEnabledMutation.data;

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-uploads">
      <section className="legacy-v1-mast">
        <div className="video-transcript-settings-wrapper" />
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Content</span>
            <span>Video Uploads</span>
          </h1>
          <p className="legacy-v1-muted">{location.pathname}</p>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <button
            type="button"
            className="legacy-v1-btn"
            onClick={() => {
              if (courseIdInput.trim()) {
                transcriptPreferencesMutation.mutate(courseIdInput.trim());
                transcriptCredentialsMutation.mutate(courseIdInput.trim());
              }
            }}
            disabled={transcriptPreferencesMutation.isPending || transcriptCredentialsMutation.isPending}
          >
            Course Video Settings
          </button>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main" role="main">
          <section className="legacy-v1-data-box">
            <h2>Video Uploads Workspace</h2>
            <p>This page mirrors the legacy Studio video uploads template and exposes the same upload/status/settings endpoints.</p>
          </section>
          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate(filename || undefined);
            }}
          >
            <h2>Upload New Video</h2>
            <label>
              Filename
              <input value={filename} onChange={(event) => setFilename(event.target.value)} placeholder="intro.mp4" />
            </label>
            <div className="actions">
              <button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Upload'}
              </button>
            </div>
            {createMutation.error ? <p className="error-text">Failed to create upload.</p> : null}
          </form>

          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (token.trim()) {
                statusMutation.mutate(token.trim());
              }
            }}
          >
            <h2>Active Video Upload</h2>
            <label>
              Upload Token
              <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="up-token-1" />
            </label>
            <div className="actions">
              <button type="submit" disabled={statusMutation.isPending}>
                {statusMutation.isPending ? 'Loading...' : 'Load Upload Status'}
              </button>
            </div>
            {statusMutation.error ? <p className="error-text">Failed to load upload status.</p> : null}
          </form>

          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (courseIdInput.trim()) {
                uploadLinkMutation.mutate(courseIdInput.trim());
              }
            }}
          >
            <h2>Course Video Endpoints</h2>
            <label>
              Course ID
              <input value={courseIdInput} onChange={(event) => setCourseIdInput(event.target.value)} />
            </label>
            <div className="actions">
              <button type="submit" disabled={uploadLinkMutation.isPending}>
                {uploadLinkMutation.isPending ? 'Loading...' : 'Generate Video Upload Link'}
              </button>
              <button type="button" onClick={() => videoImagesEnabledMutation.mutate()} disabled={videoImagesEnabledMutation.isPending}>
                Video Images Enabled
              </button>
              <button type="button" onClick={() => videoFeaturesMutation.mutate()} disabled={videoFeaturesMutation.isPending}>
                Video Features
              </button>
              <button
                type="button"
                onClick={() => courseIdInput.trim() && videoEncodingsMutation.mutate(courseIdInput.trim())}
                disabled={videoEncodingsMutation.isPending}
              >
                Encodings Download
              </button>
            </div>
            <p className="legacy-v1-tip">Use this section to load upload links, transcript settings, image support, and encoding downloads.</p>
          </form>

          <section className="legacy-v1-subnav">
            <Link to="/course/">Studio Home</Link>
            <Link to="/contentstore">Contentstore</Link>
            <Link to="/resource-builder">Resource Builder</Link>
            <span className="legacy-v1-path">{params.courseKey ? seededCourseKey : pathSeeds.courseId || '(no course key)'}</span>
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Latest Response</h3>
            {latestResponse ? <pre>{JSON.stringify(latestResponse, null, 2)}</pre> : <p className="legacy-v1-muted">Run one of the actions to see response payload.</p>}
          </div>
          <div className="legacy-v1-side-bit">
            <h3>Transcript Diagnostics</h3>
            <div className="actions">
              <button
                type="button"
                onClick={() => {
                  if (!courseIdInput.trim()) {
                    return;
                  }
                  transcriptPreferencesMutation.mutate(courseIdInput.trim());
                  transcriptCredentialsMutation.mutate(courseIdInput.trim());
                }}
                disabled={transcriptPreferencesMutation.isPending || transcriptCredentialsMutation.isPending}
              >
                Load Transcript Settings
              </button>
            </div>
            {transcriptPreferencesMutation.error ? <p className="error-text">Failed transcript preferences.</p> : null}
            {transcriptCredentialsMutation.error ? <p className="error-text">Failed transcript credentials.</p> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
