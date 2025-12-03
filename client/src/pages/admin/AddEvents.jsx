import React, { useState } from "react";
import Title from "../../components/admin/Title";
import api from "../../lib/api";

const AddEvents = () => {
  const [form, setForm] = useState({
    title: "",
    overview: "",
    poster_path: "",
    backdrop_path: "",
    release_date: "",
    tagline: "",
    genres: "",
    vote_average: "",
    runtime: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const genresArray = form.genres
        ? form.genres.split(",").map((name, index) => ({
            id: index + 1,
            name: name.trim(),
          }))
        : [];

      await api.post("/events", {
        title: form.title,
        overview: form.overview,
        poster_path: form.poster_path,
        backdrop_path: form.backdrop_path || form.poster_path,
        release_date: form.release_date,
        tagline: form.tagline,
        genres: genresArray,
        vote_average: form.vote_average
          ? parseFloat(form.vote_average)
          : undefined,
        runtime: form.runtime ? parseInt(form.runtime) : undefined,
      });

      alert("Event added successfully!");
      setForm({
        title: "",
        overview: "",
        poster_path: "",
        backdrop_path: "",
        release_date: "",
        tagline: "",
        genres: "",
        vote_average: "",
        runtime: "",
      });
    } catch (err) {
      console.error("Failed to add event:", err);
      alert("Failed to add event. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Title text1="Add" text2="Events" />
      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-xl space-y-4 bg-gray-900/40 p-6 rounded-xl border border-gray-700"
      >
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Overview / Description</label>
          <textarea
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none h-24"
            name="overview"
            value={form.overview}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Poster URL</label>
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
            name="poster_path"
            value={form.poster_path}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Backdrop URL (optional, used for banner)
          </label>
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
            name="backdrop_path"
            value={form.backdrop_path}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Event Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
              name="release_date"
              value={form.release_date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Runtime (minutes)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
              name="runtime"
              value={form.runtime}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Tagline</label>
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">
              Genres (comma separated, e.g. Tech, Cultural)
            </label>
            <input
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
              name="genres"
              value={form.genres}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Rating (0-10)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
              name="vote_average"
              value={form.vote_average}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-8 py-2 mt-4 rounded hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-60"
        >
          {saving ? "Saving..." : "Add Event"}
        </button>
      </form>
    </>
  );
};

export default AddEvents;
