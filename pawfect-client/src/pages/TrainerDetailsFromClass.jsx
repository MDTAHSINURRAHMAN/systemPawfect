import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const TrainerDetailsFromClass = () => {
  const { id } = useParams();

  const { data: trainer, isLoading } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const res = await axios.get(`https://pawfect-server-beige.vercel.app/trainers/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={trainer.profileImage}
              alt={trainer.fullName}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="md:w-2/3 p-8">
            <h1 className="text-4xl font-bold mb-4">{trainer.fullName}</h1>
            <div className="mb-6">
              <p className="text-gray-600">
                Experience: {trainer.experience} years
              </p>
              <p className="text-gray-600">Age: {trainer.age} years</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {trainer.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Availability</h3>
              <p className="mb-2">Days: {trainer.availableDays?.join(", ")}</p>
              <p>Time: {trainer.availableTime}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Classes</h3>
              <div className="flex flex-wrap gap-2">
                {trainer.classes?.map((className, index) => (
                  <span
                    key={index}
                    className="bg-[#FF640D] text-white px-3 py-1 rounded-full text-sm"
                  >
                    {className}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {trainer.socialMedia?.facebook && (
                <a
                  href={trainer.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Facebook
                </a>
              )}
              {trainer.socialMedia?.twitter && (
                <a
                  href={trainer.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600"
                >
                  Twitter
                </a>
              )}
              {trainer.socialMedia?.instagram && (
                <a
                  href={trainer.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetailsFromClass;
