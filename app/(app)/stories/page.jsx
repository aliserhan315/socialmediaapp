import Stories from "@/components/Stories";

export default function StoriesPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-white bg-blue-600 p-4 rounded-t-lg">
        Stories
      </h1>
      <Stories />
    </div>
  );
}
