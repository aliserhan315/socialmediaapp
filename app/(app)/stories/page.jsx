import Box from "@/components/Box";
import Stories from "@/components/Stories";
import css from "@/styles/PostGenerator.module.css";

export default function StoriesPage() {
  return (
    <div className="p-4">
      <Box className={css.container}>
        <h1
          className="text-xl font-bold mb-14 bg-blue-600 p-4 rounded-t-lg bg-primary "
          style={{ color: "#0070f3" }}
        >
          Stories
        </h1>
      </Box>
      <div>
        <br />
      </div>
      <Stories />
    </div>
  );
}
