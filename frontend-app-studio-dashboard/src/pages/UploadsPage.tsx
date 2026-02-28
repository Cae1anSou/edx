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

  const [filename, setFilename] = useState(seededCourseKey ? `${seededCourseKey}.mp4` : 'syllabus.pdf');
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

  const statusMutation = useMutation({
    mutationFn: fetchUpload
  });
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

  return (
    <main className="container">
      <header className="page-header">
        <h1>Uploads</h1>
        <p>React migration of video and transcript upload/status flows.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
        {params.courseKey ? (
          <p>
            <strong>Legacy route course key:</strong> {seededCourseKey}
          </p>
        ) : null}
        {pathSeeds.courseId && !params.courseKey ? (
          <p>
            <strong>Detected legacy course key:</strong> {pathSeeds.courseId}
          </p>
        ) : null}
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          createMutation.mutate(filename || undefined);
        }}
      >
        <h2>Create Upload</h2>
        <label>
          filename
          <input value={filename} onChange={(event) => setFilename(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Upload'}
          </button>
        </div>
        {createMutation.error ? <p className="error-text">Failed to create upload.</p> : null}
        {createMutation.data ? <pre>{JSON.stringify(createMutation.data, null, 2)}</pre> : null}
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
        <h2>Upload Status</h2>
        <label>
          token
          <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="up-token-1" />
        </label>
        <div className="actions">
          <button type="submit" disabled={statusMutation.isPending}>
            {statusMutation.isPending ? 'Loading...' : 'Load Status'}
          </button>
        </div>
        {statusMutation.error ? <p className="error-text">Failed to load upload status.</p> : null}
        {statusMutation.data ? <pre>{JSON.stringify(statusMutation.data, null, 2)}</pre> : null}
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
        <h2>Video Upload Link</h2>
        <label>
          course id
          <input value={courseIdInput} onChange={(event) => setCourseIdInput(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={uploadLinkMutation.isPending}>
            {uploadLinkMutation.isPending ? 'Loading...' : 'Generate Upload Link'}
          </button>
          <button type="button" onClick={() => videoImagesEnabledMutation.mutate()} disabled={videoImagesEnabledMutation.isPending}>
            {videoImagesEnabledMutation.isPending ? 'Loading...' : 'Video Images Enabled'}
          </button>
          <button type="button" onClick={() => videoFeaturesMutation.mutate()} disabled={videoFeaturesMutation.isPending}>
            {videoFeaturesMutation.isPending ? 'Loading...' : 'Video Features'}
          </button>
        </div>
        {uploadLinkMutation.error ? <p className="error-text">Failed to generate upload link.</p> : null}
        {uploadLinkMutation.data ? <pre>{JSON.stringify(uploadLinkMutation.data, null, 2)}</pre> : null}
        {videoImagesEnabledMutation.error ? <p className="error-text">Failed to load video images feature flag.</p> : null}
        {videoImagesEnabledMutation.data ? <pre>{JSON.stringify(videoImagesEnabledMutation.data, null, 2)}</pre> : null}
        {videoFeaturesMutation.error ? <p className="error-text">Failed to load video features.</p> : null}
        {videoFeaturesMutation.data ? <pre>{JSON.stringify(videoFeaturesMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (courseIdInput.trim()) {
            transcriptPreferencesMutation.mutate(courseIdInput.trim());
            transcriptCredentialsMutation.mutate(courseIdInput.trim());
            videoEncodingsMutation.mutate(courseIdInput.trim());
          }
        }}
      >
        <h2>Transcript and Encoding</h2>
        <label>
          course id
          <input value={courseIdInput} onChange={(event) => setCourseIdInput(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={transcriptPreferencesMutation.isPending || transcriptCredentialsMutation.isPending || videoEncodingsMutation.isPending}>
            {transcriptPreferencesMutation.isPending || transcriptCredentialsMutation.isPending || videoEncodingsMutation.isPending
              ? 'Loading...'
              : 'Load Transcript/Encoding'}
          </button>
        </div>
        {transcriptPreferencesMutation.error ? <p className="error-text">Failed to load transcript preferences.</p> : null}
        {transcriptPreferencesMutation.data ? <pre>{JSON.stringify(transcriptPreferencesMutation.data, null, 2)}</pre> : null}
        {transcriptCredentialsMutation.error ? <p className="error-text">Failed to load transcript credentials.</p> : null}
        {transcriptCredentialsMutation.data ? <pre>{JSON.stringify(transcriptCredentialsMutation.data, null, 2)}</pre> : null}
        {videoEncodingsMutation.error ? <p className="error-text">Failed to load video encodings.</p> : null}
        {videoEncodingsMutation.data ? <pre>{JSON.stringify(videoEncodingsMutation.data, null, 2)}</pre> : null}
      </form>
    </main>
  );
}
