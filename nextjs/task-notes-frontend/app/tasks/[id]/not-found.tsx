import Link from "next/link";

export default function TaskNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* <span className="text-6xl mb-4">📭</span> */}
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Task Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        The task you&apos;re looking for doesn&apos;t exist or may have been
        deleted. Double-check the ID and try again.
      </p>
      <Link
        href="/tasks"
        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
      >
        Back to All Tasks
      </Link>
    </div>
  );
}
