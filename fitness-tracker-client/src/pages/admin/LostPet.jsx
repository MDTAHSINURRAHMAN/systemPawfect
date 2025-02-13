import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

const LostPet = () => {
  const queryClient = useQueryClient();

  const { data: lostPets = [], isLoading } = useQuery({
    queryKey: ["lostPets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/lost-pets/admin");
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedPet) => {
      const res = await axios.patch(
        `http://localhost:5000/lost-pets/${updatedPet._id}`,
        updatedPet
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["lostPets"]);
      toast.success("Pet report updated successfully");
    },
    onError: () => {
      toast.error("Failed to update pet report");
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (updatedPet) => {
      const res = await axios.patch(
        `http://localhost:5000/lost-pets/status/${updatedPet._id}`,
        { status: updatedPet.status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["lostPets"]);
      toast.success("Pet status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update pet status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (petId) => {
      const res = await axios.delete(`http://localhost:5000/lost-pets/${petId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["lostPets"]);
      toast.success("Pet report deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete pet report");
    },
  });

  const handleApprove = (pet) => {
    updateMutation.mutate({ ...pet, approved: true });
  };

  const handleStatusUpdate = (pet) => {
    const newStatus = pet.status === "lost" ? "found" : "lost";
    statusMutation.mutate({ ...pet, status: newStatus });
  };

  const handleDelete = (petId) => {
    if (window.confirm("Are you sure you want to delete this pet report?")) {
      deleteMutation.mutate(petId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6">Lost Pet Reports</h2>
      <div className="grid gap-6">
        {lostPets.map((pet) => (
          <div key={pet._id} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/4">
                <img
                  src={pet.petImage}
                  alt={pet.petName}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{pet.petName}</h3>
                    <p className="text-gray-600">{pet.breed}</p>
                    <p className="text-gray-600">{pet.description}</p>
                  </div>
                  <div className="space-x-2">
                    {!pet.approved ? (
                      <button
                        onClick={() => handleApprove(pet)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Approve
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(pet)}
                          className={`px-4 py-2 ${
                            pet.status === "lost" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
                          } text-white rounded-lg mr-2`}
                        >
                          Mark as {pet.status === "lost" ? "Found" : "Lost"}
                        </button>
                        <button
                          onClick={() => handleDelete(pet._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Owner: {pet.ownerName}</p>
                  <p>Contact: {pet.contactNumber}</p>
                  <p>Last Seen: {new Date(pet.lastSeenDate).toLocaleDateString()}</p>
                  <p>Status: {pet.approved ? (pet.status === "lost" ? "Lost" : "Found") : "Pending Approval"}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostPet;
