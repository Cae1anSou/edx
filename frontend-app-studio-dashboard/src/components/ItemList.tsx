import { StudioCourseItem, StudioLibraryItem } from '../types';

type Props = {
  courses?: StudioCourseItem[];
  libraries?: StudioLibraryItem[];
  allowReruns: boolean;
};

function CourseCard({ item, allowReruns }: { item: StudioCourseItem; allowReruns: boolean }) {
  const rerunHref = item.rerunLink ?? `/rerun?source_course_key=${encodeURIComponent(item.courseKey)}`;
  return (
    <li className="item-card">
      <a href={item.url} className="item-main-link">
        <h3>{item.displayName}</h3>
        <p>
          <strong>Organization:</strong> {item.org}
        </p>
        <p>
          <strong>Course Number:</strong> {item.number}
        </p>
        <p>
          <strong>Course Run:</strong> {item.run}
        </p>
      </a>
      <div className="item-actions">
        {allowReruns ? <a href={rerunHref}>Re-run Course</a> : null}
        {item.lmsLink ? <a href={item.lmsLink}>View Live</a> : null}
      </div>
    </li>
  );
}

function LibraryCard({ item }: { item: StudioLibraryItem }) {
  return (
    <li className="item-card">
      <a href={item.url} className="item-main-link">
        <h3>{item.displayName}</h3>
        <p>
          <strong>Organization:</strong> {item.org}
        </p>
        <p>
          <strong>Library Code:</strong> {item.number}
        </p>
      </a>
    </li>
  );
}

export function ItemList({ courses = [], libraries = [], allowReruns }: Props) {
  const list = courses.length > 0 ? courses : libraries;
  if (list.length === 0) {
    return <p className="empty-state">No items found.</p>;
  }

  return (
    <ul className="item-list">
      {courses.length > 0
        ? courses.map((item) => <CourseCard key={item.id} item={item} allowReruns={allowReruns} />)
        : libraries.map((item) => <LibraryCard key={item.id} item={item} />)}
    </ul>
  );
}
