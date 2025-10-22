import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = {
  url: string;
  title: string;
  className?: string;
};

type GalleryCategory = {
  title: string;
  description: string;
  images: GalleryImage[];
};

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{
    catIndex: number;
    imgIndex: number;
  } | null>(null);

  const galleryCategories: GalleryCategory[] = [
    {
      title: "Campus",
      description: "Explore our beautiful school campus and surroundings",
      images: [
        { url: "/assets/s4.jpg", title: "Front View" },
        { url: "/assets/s1.jpg", title: "Side View" },
        { url: "/assets/s2.jpg", title: "Classroom View" },
        { url: "/assets/s5.jpg", title: "Months in Arabic" },
      ],
    },
    {
      title: "NJC",
      description: "National Juniors Challenge activities and achievements",
      images: [
        { url: "/assets/q1.jpg", title: "Team Practice", className: "object-contain h-48" },
        { url: "/assets/q3.jpg", title: "Team Picture", className: "object-contain h-48" },
        { url: "/assets/q4.jpg", title: "Before a Contest", className: "object-contain h-48" },
        { url: "/assets/q5.jpg", title: "On Stage", className: "object-contain h-48" },
      ],
    },
    {
      title: "Facilities",
      description: "Modern facilities available to students",
      images: [
        { url: "/assets/l1.jpg", title: "Modern Lavatory(Front view)" },
        { url: "/assets/l2.jpg", title: "Modern Lavatory(Side view)" },
        { url: "/assets/masjid.jpg", title: "School Mosque (Front View)" },
        { url: "/assets/m2.jpg", title: "School Mosque (Side View)" },
      ],
    },
    {
      title: "Sports",
      description: "Sports events and moments",
      images: [
        { url: "/assets/b1.jpg", title: "After Game" },
        { url: "/assets/t.jpg", title: "School Team", className: "object-contain h-250" },
      ],
    },
    {
      title: "Creative Ideas",
      description: "Innovative projects and creations by our students",
      images: [
        { url: "/assets/i1.jpg", title: "Voting Booth" },
        { url: "/assets/i2.jpg", title: "A bag made from box" },
      ],
    },
  ];

  const openModal = (indices: { catIndex: number; imgIndex: number }) =>
    setSelectedImage(indices);

  const closeModal = () => setSelectedImage(null);

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    const category = galleryCategories[selectedImage.catIndex];
    const length = category.images.length;
    const newIndex =
      direction === "prev"
        ? selectedImage.imgIndex === 0
          ? length - 1
          : selectedImage.imgIndex - 1
        : selectedImage.imgIndex === length - 1
        ? 0
        : selectedImage.imgIndex + 1;

    setSelectedImage({ catIndex: selectedImage.catIndex, imgIndex: newIndex });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-pink-600 mb-4">School Gallery</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a virtual tour of our campus and see the learning environment where our students grow and thrive.
          </p>
        </div>

        {galleryCategories.map((category, catIndex) => (
          <div key={catIndex} className="mb-12">
            <div className="mb-6 p-4 bg-pink-100 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-pink-600 mb-2">{category.title}</h3>
              <p className="text-gray-700">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.images.map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                  onClick={() => openModal({ catIndex, imgIndex: index })}
                >
                  {/* Title card at top */}
                  <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-center z-10">
                    <h3 className="text-sm font-semibold">{image.title}</h3>
                  </div>

                  <img
                    src={image.url}
                    alt={image.title}
                    className={`w-full h-64 ${image.className || "object-cover"}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="h-8 w-8" />
              </button>

              <button
                onClick={() => navigateImage("prev")}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={() => navigateImage("next")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              >
                <ChevronRight className="h-9 w-9" />
              </button>

              <img
                src={
                  galleryCategories[selectedImage.catIndex].images[selectedImage.imgIndex].url
                }
                alt={
                  galleryCategories[selectedImage.catIndex].images[selectedImage.imgIndex].title
                }
                className={`w-full h-auto max-h-[80vh] object-contain rounded-lg ${
                  galleryCategories[selectedImage.catIndex].images[selectedImage.imgIndex].className || ""
                }`}
              />

              {/* Title at bottom of modal */}
              <div className="absolute bottom-4 left-4 right-4 text-white bg-black bg-opacity-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {galleryCategories[selectedImage.catIndex].images[selectedImage.imgIndex].title}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
