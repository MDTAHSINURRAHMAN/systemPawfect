const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const http = require("http");
const axios = require("axios");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "");
const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173", // React app URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = process.env.PORT || 5000;

// Middleware configurations
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    // Broadcast to both room combinations
    const [user1, user2] = data.room.split("-");
    const room1 = `${user1}-${user2}`;
    const room2 = `${user2}-${user1}`;

    io.to(room1).to(room2).emit("receive_message", data.message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.bpnbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("pawfect");
    const userCollection = db.collection("users");
    const volunteerCollection = db.collection("volunteers");
    const productCollection = db.collection("products");
    const newsletterCollection = db.collection("newsletter");
    const feedbackCollection = db.collection("feedback");
    const paymentCollection = db.collection("payments");
    const reviewCollection = db.collection("reviews");
    const forumCollection = db.collection("forums");
    const productPaymentCollection = db.collection("productPayments");
    const adoptPetPaymentCollection = db.collection("adoptPetPayments");
    const petCollection = db.collection("pets");
    const messageCollection = db.collection("messages");
    const locationCollection = db.collection("locations");
    const lostPetsCollection = db.collection("lostPets");
    const vetCollection = db.collection("vets");
    const appointmentCollection = db.collection("appointments");
    const faqCollection = db.collection("faqs");

    // Create user API endpoint
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        console.log("Received user data:", user); // Debug log

        // Check if user already exists
        const existingUser = await userCollection.findOne({
          email: user.email,
        });
        if (existingUser) {
          console.log("User already exists:", user.email); // Debug log
          return res.status(400).json({ message: "User already exists" });
        }

        // Insert new user
        const result = await userCollection.insertOne(user);
        console.log("User created successfully:", result); // Debug log
        res.status(201).json(result);
      } catch (error) {
        console.error("Error creating user:", error); // Debug log
        res.status(500).json({ message: error.message });
      }
    });

    // Get user by email
    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const user = await userCollection.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // update user profile
    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;
      const updatedUser = req.body;
      const result = await userCollection.updateOne(
        { email },
        { $set: updatedUser }
      );
      res.json(result);
    });

    // Get all volunteers
    app.get("/volunteers", async (req, res) => {
      try {
        const volunteers = await volunteerCollection
          .find({ status: "active" })
          .toArray();
        res.json(volunteers);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
        res.status(500).json({ message: error.message });
      }
    });

    // Get single volunteer details
    app.get("/volunteers/:id", async (req, res) => {
      try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid volunteer ID format",
          });
        }

        const volunteer = await volunteerCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!volunteer) {
          return res.status(404).json({
            success: false,
            message: "volunteer not found",
          });
        }

        // Send response with proper JSON structure
        res.json({
          success: true,
          data: volunteer,
        });
      } catch (error) {
        console.error("Error fetching volunteer:", error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch volunteer details",
          error: error.message,
        });
      }
    });

    // get volunteer by email
    app.get("/volunteer-by-email/:email", async (req, res) => {
      const email = req.params.email;
      const volunteer = await volunteerCollection.findOne({ email });
      res.json(volunteer);
    });

    // Create volunteer API endpoint
    app.post("/volunteers", async (req, res) => {
      try {
        const volunteer = req.body;

        // Add slot IDs to available days
        if (volunteer.availableDays) {
          volunteer.availableDays = volunteer.availableDays.map((day) => ({
            day,
            slotId: Math.random().toString(36).substring(2, 15),
          }));
        }

        const result = await volunteerCollection.insertOne(volunteer);

        // Add volunteer's classes to classes collection
        if (volunteer.classes && volunteer.classes.length > 0) {
          const classPromises = volunteer.classes.map(async (className) => {
            const classData = {
              name: className,
              volunteerId: result.insertedId,
              volunteerName: volunteer.fullName,
              description:
                volunteer.classDescriptions?.[className] ||
                `${className} class description`,
              intensity: ["Beginner", "Intermediate", "Advanced"],
              equipment: volunteer.classEquipment?.[className] || [],
              duration: volunteer.classDurations?.[className] || "60 mins",
              image:
                volunteer.classImages?.[className] ||
                "/default-class-image.jpg",
              specializedvolunteers: [
                {
                  id: result.insertedId,
                  name: volunteer.fullName,
                  experience: volunteer.experience,
                  skills: volunteer.skills,
                  age: volunteer.age,
                  profileImage: volunteer.profileImage,
                  availableDays: volunteer.availableDays,
                  availableTime: volunteer.availableTime,
                  socialMedia: {
                    facebook: volunteer.facebook,
                    twitter: volunteer.twitter,
                    instagram: volunteer.instagram,
                  },
                },
              ],
            };
            return productCollection.insertOne(classData);
          });
          await Promise.all(classPromises);
        }

        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // delete volunteer
    app.delete("/volunteers/:id", async (req, res) => {
      try {
        const id = req.params.id;

        // Get volunteer info before deleting
        const volunteer = await volunteerCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!volunteer) {
          return res.status(404).json({ message: "volunteer not found" });
        }

        // Delete from volunteer collection
        await volunteerCollection.deleteOne({ _id: new ObjectId(id) });

        // Update user role to member in user collection
        await userCollection.updateOne(
          { email: volunteer.email },
          { $set: { role: "member" } }
        );

        res.json({
          message: "volunteer deleted and role updated successfully",
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // pending volunteers
    app.get("/pending-volunteers", async (req, res) => {
      const volunteers = await volunteerCollection
        .find({ status: "pending" })
        .toArray();
      res.json(volunteers);
    });

    // update volunteer status
    app.patch("/volunteers/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const status = req.body.status;

        // Get volunteer info before updating status
        const volunteer = await volunteerCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!volunteer) {
          return res.status(404).json({ message: "volunteer not found" });
        }

        // Update volunteer status
        const result = await volunteerCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } }
        );

        // If approved, update user role to volunteer
        if (status === "active") {
          await userCollection.updateOne(
            { email: volunteer.email },
            { $set: { role: "volunteer" } }
          );
        }

        res.json({ message: "volunteer status updated successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // reject volunteer
    app.patch("/volunteers/:id/reject", async (req, res) => {
      try {
        const id = req.params.id;
        const feedback = req.body.feedback;

        // Get volunteer info before deleting
        const volunteer = await volunteerCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!volunteer) {
          return res.status(404).json({ message: "volunteer not found" });
        }

        // Add feedback to feedback collection
        await feedbackCollection.insertOne({
          userId: volunteer._id,
          email: volunteer.email,
          feedback: feedback,
          type: "volunteer_rejection",
          createdAt: new Date(),
        });

        // Delete volunteer application
        await volunteerCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "rejected" } }
        );

        res.json({
          message: "volunteer rejected and feedback saved successfully",
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // get volunteer by id
    app.get("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const volunteer = await volunteerCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(volunteer);
    });

    // get volunteer by email
    app.get("/volunteer-profile/:email", async (req, res) => {
      const email = req.params.email;
      const volunteer = await volunteerCollection.findOne({ email });
      res.json(volunteer);
    });

    // get all volunteers
    app.get("/all-volunteers", async (req, res) => {
      const volunteers = await volunteerCollection
        .find({ status: "pending", status: "rejected" })
        .toArray();
      res.json(volunteers);
    });

    // get volunteer by id and slot id
    // app.get("/volunteers/:id/:slotId", async (req, res) => {
    //   const { id, slotId } = req.params;
    //   const volunteer = await volunteerCollection.findOne({ _id: new ObjectId(id) });
    //   res.json(volunteer);
    // });

    // get feedback by volunteer id
    app.get("/feedback/:email", async (req, res) => {
      const email = req.params.email;
      const feedback = await feedbackCollection.findOne({ email });
      res.json(feedback);
    });

    // user role
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email });
      console.log(user);
      res.json(user);
    });

    // admin login
    app.post("/admin/login", async (req, res) => {
      const email = req.body.email;
      const password = req.body.password;
      const admin = await userCollection.findOne({ email, password });
      if (admin) {
        res.json(admin);
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    });

    // newsletter subscribe
    app.post("/newsletter/subscribe", async (req, res) => {
      const { name, email } = req.body;
      const result = await newsletterCollection.insertOne({
        name,
        email,
        date: new Date(),
      });
      res.status(201).json(result);
    });

    // get all newsletter subscribers
    app.get("/newsletter/subscribers", async (req, res) => {
      const subscribers = await newsletterCollection.find().toArray();
      res.json(subscribers);
    });

    // get all products
    app.get("/products", async (req, res) => {
      const products = await productCollection.find().toArray();
      res.json(products);
    });

    // add product
    app.post("/products", async (req, res) => {
      try {
        const newProduct = req.body;
        const result = await productCollection.insertOne(newProduct);

        // Send only the necessary data
        res.status(201).json({
          success: true,
          insertedId: result.insertedId,
          message: "Product added successfully",
        });
      } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
          success: false,
          message: "Error adding product",
          error: error.message,
        });
      }
    });

    // Get product details and available volunteers by product ID
    // app.get('/products/:id', async (req, res) => {
    //     try {
    //       const productId = req.params.id;

    //       // Get product details
    //       const productDetails = await productCollection.findOne({
    //         _id: new ObjectId(productId)
    //       });

    //       if (!productDetails) {
    //         return res.status(404).json({
    //           success: false,
    //           message: 'Product not found'
    //         });
    //       }

    //       // Get volunteers for this product
    //       const volunteers = await volunteerCollection.find({
    //         products: productDetails.name,
    //         status: 'active'
    //       }).toArray();

    //       res.json({
    //         success: true,
    //         productDetails,
    //         volunteers
    //       });

    //     } catch (error) {
    //       console.error('Error fetching product details:', error);
    //       res.status(500).json({
    //         success: false,
    //         message: 'Error fetching product details',
    //         error: error.message
    //       });
    //     }
    // });

    // get product by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(product);
    });

    // update product
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const result = await productCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedProduct }
      );
      res.json(result);
    });

    // delete product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    // Create payment intent
    app.post("/create-payment-intent", async (req, res) => {
      try {
        const { price, volunteerId, slotId } = req.body;

        // Update volunteer's availableDays with booking info
        await volunteerCollection.updateOne(
          { _id: new ObjectId(volunteerId), "availableDays.slotId": slotId },
          {
            $set: {
              "availableDays.$.isBooked": true,
              "availableDays.$.bookedBy": req.body.email,
            },
          }
        );

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
          amount: price * 100, // Convert to cents
          currency: "usd",
          payment_method_types: ["card"],
        });

        res.json({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error("Payment Intent Error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // get booked volunteers
    app.get("/booked-volunteers", async (req, res) => {
      const bookedvolunteers = await paymentCollection.find().toArray();
      res.json(bookedvolunteers);
    });

    // chat with volunteers by id
    app.get("/chat-with-volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const bookedvolunteers = await volunteerCollection
        .find({ _id: new ObjectId(id) })
        .toArray();
      res.json(bookedvolunteers);
    });

    // delete slot
    app.delete("/slots/:id", async (req, res) => {
      const id = req.params.id;
      const result = await volunteerCollection.updateOne(
        { "availableDays.slotId": id },
        { $pull: { availableDays: { slotId: id } } }
      );
      res.json(result);
    });

    // Save payment info after successful payment
    app.post("/payments", async (req, res) => {
      try {
        const payment = req.body;
        const { amount, trainerId, slotId } = req.body;

        // Update volunteer's availableDays with booking info
        await volunteerCollection.updateOne(
          { _id: new ObjectId(trainerId), "availableDays.slotId": slotId },
          {
            $set: {
              "availableDays.$.isBooked": true,
              "availableDays.$.bookedBy": payment.userEmail,
            },
          }
        );

        const result = await paymentCollection.insertOne(payment);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // get all slots
    app.get("/all-slots", async (req, res) => {
      try {
        // Get all volunteers with their slots
        const volunteers = await volunteerCollection.find().toArray();

        // Initialize array to store all slots
        let allSlots = [];

        // Iterate through each volunteer
        volunteers.forEach((volunteer) => {
          if (volunteer.availableDays) {
            // Get all slots for this volunteer
            volunteer.availableDays.forEach((slot) => {
              // Add each slot with volunteer info
              allSlots.push({
                _id: slot.slotId,
                volunteerId: volunteer._id,
                volunteerName: volunteer.name,
                volunteerEmail: volunteer.email,
                slotId: slot.slotId,
                day: slot.day,
                isBooked: slot.isBooked || false,
                bookedBy: slot.bookedBy || null,
              });
            });
          }
        });

        console.log("All slots found:", allSlots);
        res.json(allSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // post review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    // get all reviews
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewCollection.find().toArray();
      res.json(reviews);
    });

    // get all forums
    app.get("/forums", async (req, res) => {
      const forums = await forumCollection.find().toArray();
      res.json(forums);
    });

    // get forum by id
    app.get("/forums/:id", async (req, res) => {
      const id = req.params.id;
      const forum = await forumCollection.findOne({ _id: new ObjectId(id) });
      res.json(forum);
    });

    // vote forum
    app.post("/forums/:id/vote", async (req, res) => {
      const { id } = req.params;
      const { userId, voteType } = req.body;
      const result = await forumCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { [voteType]: 1 } }
      );
      res.json(result);
    });

    // post forum
    app.post("/forums", async (req, res) => {
      const forum = req.body;
      const result = await forumCollection.insertOne(forum);
      res.json(result);
    });

    // get bookings and user stats
    app.get("/admin/dashboard-stats", async (req, res) => {
      try {
        const bookings = await paymentCollection.find().toArray();
        const subscribers = await newsletterCollection.find().toArray();

        res.json({
          bookings,
          stats: subscribers,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // post slot in volunteer collection with volunteer email
    app.post("/volunteer-slots/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const { days, slotTime, classes } = req.body;

        console.log(days, slotTime, classes);

        // Update availableDays, availableTime and classes for the volunteer
        const result = await volunteerCollection.updateOne(
          { email },
          {
            $push: {
              availableDays: { $each: days },
              classes: { $each: classes },
            },
            $set: {
              availableTime: slotTime,
            },
          }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "volunteer not found" });
        }

        res.json({ message: "Slot and classes updated successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // SSL payment initialization
    app.post("/ssl-payment", async (req, res) => {
      try {
        const payment = req.body;
        const tran_id = "PAW-" + new Date().getTime();

        // 1. First create pending payment record in MongoDB
        const paymentRecord = {
          tran_id,
          status: "pending",
          createdAt: new Date(),
          total_amount: payment.total_amount,
          currency: payment.currency || "BDT",
          ...payment,
          statusHistory: [
            {
              status: "pending",
              timestamp: new Date(),
              details: "Payment initiated",
            },
          ],
        };

        await productPaymentCollection.insertOne(paymentRecord);
        console.log("Created pending payment record:", tran_id);

        // 2. Initialize SSL Commerz with tran_id in query params
        const sslData = {
          store_id: "pawfe679fae25324c8",
          store_passwd: "pawfe679fae25324c8@ssl",
          total_amount: payment.total_amount,
          currency: payment.currency || "BDT",
          tran_id,
          // Add tran_id to URLs for tracking
          success_url: `http://localhost:5000/payment/success?tran_id=${tran_id}`,
          fail_url: `http://localhost:5000/payment/fail?tran_id=${tran_id}`,
          cancel_url: `http://localhost:5000/payment/cancel?tran_id=${tran_id}`,
          ipn_url: `http://localhost:5000/payment/ipn?tran_id=${tran_id}`,
          shipping_method: "NO",
          product_name: payment.product_name,
          product_category: payment.product_category,
          product_profile: "general",
          cus_name: payment.cus_name,
          cus_email: payment.cus_email,
          cus_add1: payment.cus_add1,
          cus_city: payment.cus_city,
          cus_state: payment.cus_state,
          cus_postcode: payment.cus_postcode,
          cus_country: payment.cus_country,
          cus_phone: payment.cus_phone,
        };

        const response = await axios.post(
          "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
          sslData,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        if (response.data?.GatewayPageURL) {
          return res.json({
            status: "success",
            GatewayPageURL: response.data.GatewayPageURL,
            tran_id: tran_id,
            data: response.data,
          });
        } else {
          throw new Error("Failed to get gateway URL");
        }
      } catch (error) {
        console.error("Payment initialization error:", error);
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
    });

    // Success handler - now gets tran_id from query params if not in body
    app.post("/payment/success", async (req, res) => {
      try {
        const tran_id = req.body.tran_id || req.query.tran_id;
        console.log("Success payment data received:", { ...req.body, tran_id });

        if (!tran_id) {
          console.error("No transaction ID found in success request");
          return res.redirect("http://localhost:5173/payment/error");
        }

        // Get payment details to get product info
        const payment = await productPaymentCollection.findOne({ tran_id });

        // Update payment status to completed
        const result = await productPaymentCollection.updateOne(
          { tran_id },
          {
            $set: {
              status: "completed",
              paymentCompletedAt: new Date(),
              paymentDetails: req.body,
            },
            $push: {
              statusHistory: {
                status: "completed",
                timestamp: new Date(),
                details: "Payment completed successfully",
                paymentData: req.body,
              },
            },
          }
        );

        // First, get the current product to ensure stockQuantity is numeric
        const product = await productCollection.findOne({
          _id: new ObjectId(payment.productId),
        });
        const currentStock = parseInt(product.stockQuantity) || 0; // Convert to number or default to 0

        // Then update the product with the new numeric stock quantity
        const productResult = await productCollection.updateOne(
          { _id: new ObjectId(payment.productId) },
          { $set: { stockQuantity: currentStock - 1 } }
        );

        console.log("Payment marked as completed:", tran_id);

        if (result.modifiedCount === 0 || productResult.modifiedCount === 0) {
          console.error("Failed to update payment or product:", {
            payment: result.modifiedCount,
            product: productResult.modifiedCount,
          });
          return res.redirect("http://localhost:5173/payment/error");
        }

        res.redirect("http://localhost:5173/payment/success");
      } catch (error) {
        console.error("Success handler error:", error);
        res.redirect("http://localhost:5173/payment/error");
      }
    });

    // Fail handler with proper tran_id handling
    app.post("/payment/fail", async (req, res) => {
      try {
        // Get tran_id from either body or query params
        const tran_id = req.body.tran_id || req.query.tran_id;
        console.log("Failed payment data received:", {
          body: req.body,
          query: req.query,
          tran_id,
        });

        if (!tran_id) {
          console.error("No transaction ID found in fail request");
          return res.redirect("http://localhost:5173/payment/error");
        }

        const result = await productPaymentCollection.updateOne(
          { tran_id },
          {
            $set: {
              status: "failed",
              paymentFailedAt: new Date(),
              failureDetails: req.body,
            },
            $push: {
              statusHistory: {
                status: "failed",
                timestamp: new Date(),
                details: "Payment failed",
                failureData: req.body,
              },
            },
          }
        );

        console.log("Payment marked as failed:", tran_id);

        if (result.modifiedCount === 0) {
          console.error("No payment found to update:", tran_id);
          return res.redirect("http://localhost:5173/payment/error");
        }

        res.redirect("http://localhost:5173/payment/fail");
      } catch (error) {
        console.error("Fail handler error:", error);
        res.redirect("http://localhost:5173/payment/error");
      }
    });

    // Cancel handler with proper tran_id handling
    app.post("/payment/cancel", async (req, res) => {
      try {
        const tran_id = req.body.tran_id || req.query.tran_id;
        console.log("Cancelled payment data received:", {
          body: req.body,
          query: req.query,
          tran_id,
        });

        if (!tran_id) {
          console.error("No transaction ID found in cancel request");
          return res.redirect("http://localhost:5173/payment/error");
        }

        const result = await productPaymentCollection.updateOne(
          { tran_id },
          {
            $set: {
              status: "cancelled",
              paymentCancelledAt: new Date(),
              cancellationDetails: req.body,
            },
            $push: {
              statusHistory: {
                status: "cancelled",
                timestamp: new Date(),
                details: "Payment cancelled by user",
                cancellationData: req.body,
              },
            },
          }
        );

        console.log("Payment marked as cancelled:", tran_id);

        if (result.modifiedCount === 0) {
          console.error("No payment found to update:", tran_id);
          return res.redirect("http://localhost:5173/payment/error");
        }

        res.redirect("http://localhost:5173/payment/cancelled");
      } catch (error) {
        console.error("Cancel handler error:", error);
        res.redirect("http://localhost:5173/payment/error");
      }
    });

    // Add IPN (Instant Payment Notification) handler
    app.post("/payment/ipn", async (req, res) => {
      try {
        console.log("IPN Notification:", req.body); // Debug log
        const { tran_id, status } = req.body;

        await productPaymentCollection.updateOne(
          { tran_id },
          {
            $set: {
              ipn_status: status,
              ipn_details: req.body,
              updatedAt: new Date(),
            },
          }
        );

        console.log("IPN status updated:", tran_id);
        return res.status(200).json({ message: "IPN received" });
      } catch (error) {
        console.error("IPN handler error:", error);
        return res.status(500).json({ error: "IPN processing failed" });
      }
    });

    // Add a route to check payment status
    app.get("/payment/status/:tran_id", async (req, res) => {
      try {
        const { tran_id } = req.params;
        const payment = await productPaymentCollection.findOne({ tran_id });

        if (!payment) {
          return res.status(404).json({ message: "Payment not found" });
        }

        res.json(payment);
      } catch (error) {
        console.error("Payment status check error:", error);
        res.status(500).json({ error: "Failed to check payment status" });
      }
    });

    // get all product payments
    app.get("/product-payments", async (req, res) => {
      const productPayments = await productPaymentCollection.find().toArray();
      res.json(productPayments);
    });

    // get all pets
    app.get("/pets", async (req, res) => {
      const pets = await petCollection.find().toArray();
      res.json(pets);
    });

    // get pet by id
    app.get("/pets/:id", async (req, res) => {
      const id = req.params.id;
      const pet = await petCollection.findOne({ _id: new ObjectId(id) });
      res.json(pet);
    });

    // add pet
    app.post("/pets", async (req, res) => {
      const pet = req.body;
      const result = await petCollection.insertOne(pet);
      res.json(result);
    });

    // update pet
    app.patch("/pets/:id", async (req, res) => {
      const id = req.params.id;
      const updatedPet = req.body;
      const result = await petCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedPet }
      );
      res.json(result);
    });

    // delete pet
    app.delete("/pets/:id", async (req, res) => {
      const id = req.params.id;
      const result = await petCollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    // Adopt Pet Payment Initialization
    app.post("/adopt-pet-payment", async (req, res) => {
      try {
        const payment = req.body;
        console.log("Received payment data:", payment); // Debug log

        const tran_id = "ADOPT-" + new Date().getTime();

        // 1. Create pending payment record in MongoDB
        const paymentRecord = {
          tran_id,
          status: "pending",
          createdAt: new Date(),
          total_amount: payment.total_amount,
          currency: payment.currency || "BDT",
          petId: payment.petId,
          petName: payment.product_name,
          ...payment,
          statusHistory: [
            {
              status: "pending",
              timestamp: new Date(),
              details: "Adoption payment initiated",
            },
          ],
        };

        await adoptPetPaymentCollection.insertOne(paymentRecord);
        console.log("Created pending adoption payment record:", tran_id);

        // 2. Initialize SSL Commerz
        const sslData = {
          store_id: "pawfe679fae25324c8",
          store_passwd: "pawfe679fae25324c8@ssl",
          total_amount: parseFloat(payment.total_amount), // Convert to number
          currency: "BDT",
          tran_id,
          success_url: `http://localhost:5000/adopt-payment/success?tran_id=${tran_id}`,
          fail_url: `http://localhost:5000/adopt-payment/fail?tran_id=${tran_id}`,
          cancel_url: `http://localhost:5000/adopt-payment/cancel?tran_id=${tran_id}`,
          ipn_url: `http://localhost:5000/adopt-payment/ipn?tran_id=${tran_id}`,
          shipping_method: "NO",
          product_name: payment.product_name || "Pet Adoption", // Ensure product name is not undefined
          product_category: "Pet Adoption",
          product_profile: "non-physical-goods",
          cus_name: payment.cus_name,
          cus_email: payment.cus_email,
          cus_add1: payment.cus_add1 || "Address",
          cus_city: payment.cus_city || "City",
          cus_state: payment.cus_state || "State",
          cus_postcode: payment.cus_postcode || "1234",
          cus_country: "Bangladesh",
          cus_phone: payment.cus_phone,
          multi_card_name: "mastercard,visacard,amexcard",
        };

        // Validate required fields
        if (!sslData.total_amount || !sslData.product_name) {
          throw new Error(
            "Missing required fields: total_amount or product_name"
          );
        }

        console.log("Sending SSL data:", sslData); // Debug log

        const response = await axios.post(
          "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
          new URLSearchParams(sslData).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
          }
        );

        console.log("SSL Commerz Response:", response.data); // Debug log

        if (response.data?.GatewayPageURL) {
          return res.json({
            status: "success",
            GatewayPageURL: response.data.GatewayPageURL,
            tran_id: tran_id,
            data: response.data,
          });
        } else {
          console.error("SSL Commerz Error Response:", response.data);
          throw new Error(
            response.data?.failedreason || "Failed to get gateway URL"
          );
        }
      } catch (error) {
        console.error(
          "Adoption payment initialization error:",
          error.response?.data || error.message
        );
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
    });

    // Success handler for adoption payment
    app.post("/adopt-payment/success", async (req, res) => {
      try {
        const tran_id = req.body.tran_id || req.query.tran_id;
        console.log("Adoption payment success data received:", {
          ...req.body,
          tran_id,
        });

        if (!tran_id) {
          console.error("No transaction ID found in success request");
          return res.redirect("http://localhost:5173/payment/error");
        }

        // Update payment status to completed
        const result = await adoptPetPaymentCollection.updateOne(
          { tran_id },
          {
            $set: {
              status: "completed",
              paymentCompletedAt: new Date(),
              paymentDetails: req.body,
            },
            $push: {
              statusHistory: {
                status: "completed",
                timestamp: new Date(),
                details: "Adoption payment completed successfully",
                paymentData: req.body,
              },
            },
          }
        );

        // Get payment details to update pet
        const payment = await adoptPetPaymentCollection.findOne({ tran_id });

        // Update pet status to adopted
        const petResult = await petCollection.updateOne(
          { _id: new ObjectId(payment.petId) },
          {
            $set: {
              status: "adopted",
              adopted: true,
              adoptedBy: payment.cus_email,
              adoptedAt: new Date(),
              adoptionDetails: {
                customerName: payment.cus_name,
                customerEmail: payment.cus_email,
                transactionId: tran_id,
                adoptionDate: new Date(),
              },
            },
          }
        );

        console.log("Adoption payment completed and pet status updated:", {
          tran_id,
          paymentUpdated: result.modifiedCount > 0,
          petUpdated: petResult.modifiedCount > 0,
        });

        if (result.modifiedCount === 0 || petResult.modifiedCount === 0) {
          console.error("Failed to update payment or pet status:", {
            payment: result.modifiedCount,
            pet: petResult.modifiedCount,
          });
          return res.redirect("http://localhost:5173/payment/error");
        }

        res.redirect("http://localhost:5173/payment/success");
      } catch (error) {
        console.error("Adoption payment success handler error:", error);
        res.redirect("http://localhost:5173/payment/error");
      }
    });

    // Fail handler for adoption payment
    app.post("/adopt-payment/fail", async (req, res) => {
      try {
        const tran_id = req.body.tran_id || req.query.tran_id;
        console.log("Failed adoption payment data received:", {
          body: req.body,
          query: req.query,
          tran_id,
        });

        if (!tran_id) {
          console.error("No transaction ID found in fail request");
          return res.redirect("http://localhost:5173/payment/error");
        }

        const result = await adoptPetPaymentCollection.updateOne(
          { tran_id },
          {
            $set: {
              status: "failed",
              paymentFailedAt: new Date(),
              failureDetails: req.body,
            },
            $push: {
              statusHistory: {
                status: "failed",
                timestamp: new Date(),
                details: "Adoption payment failed",
                failureData: req.body,
              },
            },
          }
        );

        console.log("Adoption payment marked as failed:", tran_id);

        if (result.modifiedCount === 0) {
          console.error("No payment found to update:", tran_id);
          return res.redirect("http://localhost:5173/payment/error");
        }

        res.redirect("http://localhost:5173/payment/fail");
      } catch (error) {
        console.error("Adoption payment fail handler error:", error);
        res.redirect("http://localhost:5173/payment/error");
      }
    });

    // Cancel handler for adoption payment
    app.post("/adopt-payment/cancel", async (req, res) => {
      try {
        const tran_id = req.body.tran_id || req.query.tran_id;
        console.log("Cancelled adoption payment data received:", {
          body: req.body,
          query: req.query,
          tran_id,
        });

        if (!tran_id) {
          console.error("No transaction ID found in cancel request");
          return res.redirect("http://localhost:5173/payment/error");
        }

        const result = await adoptPetPaymentCollection.updateOne(
          { tran_id },
          {
            $set: {
              status: "cancelled",
              paymentCancelledAt: new Date(),
              cancellationDetails: req.body,
            },
            $push: {
              statusHistory: {
                status: "cancelled",
                timestamp: new Date(),
                details: "Adoption payment cancelled by user",
                cancellationData: req.body,
              },
            },
          }
        );

        console.log("Adoption payment marked as cancelled:", tran_id);

        if (result.modifiedCount === 0) {
          console.error("No payment found to update:", tran_id);
          return res.redirect("http://localhost:5173/payment/error");
        }

        res.redirect("http://localhost:5173/payment/cancel");
      } catch (error) {
        console.error("Adoption payment cancel handler error:", error);
        res.redirect("http://localhost:5173/payment/error");
      }
    });

    // get all adoption payments
    app.get("/adopt-pet-payments", async (req, res) => {
      const adoptionPayments = await adoptPetPaymentCollection.find().toArray();
      res.json(adoptionPayments);
    });

    // get all messages
    app.get("/messages", async (req, res) => {
      const messages = await messageCollection.find().toArray();
      res.json(messages);
    });

    // get messages by email
    app.get("/messages/:email", async (req, res) => {
      const email = req.params.email;
      const messages = await messageCollection.find({ email }).toArray();
      res.json(messages);
    });

    // get messages between two users
    app.get("/messages/:userId/:volunteerId", async (req, res) => {
      try {
        const { userId, volunteerId } = req.params;
        console.log("Fetching messages between:", userId, volunteerId);

        const messages = await messageCollection
          .find({
            $or: [
              { sender: userId, receiver: volunteerId },
              { sender: volunteerId, receiver: userId },
            ],
          })
          .sort({ timestamp: 1 })
          .toArray();

        console.log("Found messages:", messages.length);
        res.json(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
      }
    });

    // send message
    app.post("/messages", async (req, res) => {
      const message = req.body;
      const result = await messageCollection.insertOne(message);
      res.json(result);
    });

    // Save location
    app.post("/locations", async (req, res) => {
      try {
        const locationData = req.body;
        const result = await locationCollection.insertOne(locationData);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get locations for a specific chat
    app.get("/locations/:senderId/:receiverId", async (req, res) => {
      try {
        const { senderId, receiverId } = req.params;
        const locations = await locationCollection
          .find({
            $or: [
              { senderId, receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          })
          .sort({ timestamp: -1 })
          .toArray();
        res.json(locations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Post lost pet report
    app.post("/lost-pets", async (req, res) => {
      try {
        const report = req.body;
        console.log("Server received report data:", report);

        // Validate required fields
        if (!report.lat || !report.lng) {
          console.error("Missing coordinates");
          return res.status(400).json({
            message: "Latitude and longitude are required",
          });
        }

        // Ensure coordinates are numbers
        const lat = Number(report.lat);
        const lng = Number(report.lng);

        if (isNaN(lat) || isNaN(lng)) {
          console.error("Invalid coordinates:", { lat, lng });
          return res.status(400).json({
            message: "Invalid coordinates",
          });
        }

        // Create GeoJSON point
        const geoLocation = {
          type: "Point",
          coordinates: [lng, lat], // MongoDB expects [longitude, latitude]
        };

        // Prepare the document with required fields
        const lostPetDocument = {
          petName: report.petName,
          petType: report.petType,
          breed: report.breed || "",
          color: report.color,
          lastSeenDate: new Date(report.lastSeenDate),
          description: report.description,
          contactNumber: report.contactNumber,
          reward: report.reward || "",
          petImage: report.petImage || "",
          ownerEmail: report.ownerEmail,
          ownerName: report.ownerName,
          status: "lost",
          approved: false,
          reportDate: new Date(),
          location: geoLocation,
          lat: lat,
          lng: lng,
        };

        console.log("Attempting to save document:", lostPetDocument);

        // Ensure index exists
        await lostPetsCollection.createIndex({ location: "2dsphere" });

        // Insert document
        const result = await lostPetsCollection.insertOne(lostPetDocument);
        console.log("Document inserted successfully:", result);

        res.status(201).json({
          success: true,
          message: "Lost pet report created successfully",
          data: result,
        });
      } catch (error) {
        console.error("Server error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        res.status(500).json({
          message: "Failed to save lost pet report",
          error: error.message,
          details: error.stack,
        });
      }
    });

    // Get all lost pet reports
    app.get("/lost-pets", async (req, res) => {
      try {
        const reports = await lostPetsCollection
          .find({ approved: true, status: "lost" })
          .sort({ reportDate: -1 })
          .toArray();
        res.json(reports);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // get all lost pets for admin
    app.get("/lost-pets/admin", async (req, res) => {
      const reports = await lostPetsCollection.find().toArray();
      res.json(reports);
    });

    // Update lost pet report status
    app.patch("/lost-pets/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { approved } = req.body;
        const result = await lostPetsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { approved } }
        );
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Update lost pet report status
    app.patch("/lost-pets/status/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await lostPetsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } }
        );
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Delete lost pet report
    app.delete("/lost-pets/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await lostPetsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // get all vets
    app.get("/vets", async (req, res) => {
      const vets = await vetCollection.find().toArray();
      res.json(vets);
    });

    // add vet
    app.post("/vets", async (req, res) => {
      const vet = req.body;
      const result = await vetCollection.insertOne(vet);
      res.json(result);
    });

    // delete vet
    app.delete("/vets/:id", async (req, res) => {
      const { id } = req.params;
      const result = await vetCollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    // get vet by id
    app.get("/vets/:id", async (req, res) => {
      const { id } = req.params;
      const vet = await vetCollection.findOne({ _id: new ObjectId(id) });
      res.json(vet);
    });

    // get vet by email
    app.get("/vets/:email", async (req, res) => {
      const { email } = req.params;
      const vet = await vetCollection.findOne({ email });
      res.json(vet);
    });

    // add appointment
    app.post("/appointments", async (req, res) => {
      const appointment = req.body;
      const result = await appointmentCollection.insertOne(appointment);
      res.json(result);
    });

    // get all appointments
    app.get("/appointments", async (req, res) => {
      const appointments = await appointmentCollection.find().toArray();
      res.json(appointments);
    });

    // get appointments by email
    app.get("/appointments/:email", async (req, res) => {
      const { email } = req.params;
      const appointments = await appointmentCollection
        .find({ vetEmail: email })
        .toArray();
      res.json(appointments);
    });

    // get appointments by user email
    app.get("/appointments/user/:email", async (req, res) => {
      const { email } = req.params;
      const appointments = await appointmentCollection
        .find({ ownerEmail: email })
        .toArray();
      res.json(appointments);
    });

    // update appointment status
    app.patch("/appointments/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { status, videoCallStatus } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (videoCallStatus) updateData.videoCallStatus = videoCallStatus;

        const result = await appointmentCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        // If this is a video call update, notify the other party
        if (videoCallStatus) {
          const appointment = await appointmentCollection.findOne({
            _id: new ObjectId(id),
          });
          // You can implement notification logic here (email, push notification, etc.)
        }

        res.json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // get all faqs
    app.get("/faqs", async (req, res) => {
      const faqs = await faqCollection.find().toArray();
      res.json(faqs);
    });

    // add faq
    app.post("/faqs", async (req, res) => {
      const faq = req.body;
      const result = await faqCollection.insertOne(faq);
      res.json(result);
    });

    // update faq
    app.patch("/faqs/:id", async (req, res) => {
      const { id } = req.params;
      const { question, answer } = req.body;
      const result = await faqCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { question, answer } }
      );
      res.json(result);
    });

    // delete faq
    app.delete("/faqs/:id", async (req, res) => {
      const { id } = req.params;
      const result = await faqCollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    // Initiate video call
    app.post("/video-calls/initiate", async (req, res) => {
      try {
        const { appointmentId, vetId, userId, petName } = req.body;

        // Create a call record
        const callData = {
          appointmentId,
          vetId,
          userId,
          petName,
          status: "initiated",
          startTime: new Date(),
          roomId: `pawfect-${appointmentId}`,
        };

        await appointmentCollection.updateOne(
          { _id: new ObjectId(appointmentId) },
          {
            $set: {
              videoCallStatus: "initiated",
              callData,
            },
          }
        );

        res.json({ success: true, roomId: callData.roomId });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Check for active calls for a user
    app.get("/appointments/active-calls/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const activeCall = await appointmentCollection.findOne({
          ownerEmail: email,
          videoCallStatus: "initiated",
        });
        res.json(activeCall);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Update video call status
    app.patch("/appointments/:id/call-status", async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await appointmentCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { videoCallStatus: status } }
        );

        res.json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Modify prescription endpoints
    app.post("/prescriptions/:appointmentId", async (req, res) => {
      try {
        const { appointmentId } = req.params;
        const prescriptionData = req.body;

        // Get appointment details first
        const appointment = await appointmentCollection.findOne({
          _id: new ObjectId(appointmentId),
        });

        if (!appointment) {
          return res.status(404).json({ message: "Appointment not found" });
        }

        const prescription = {
          appointmentId: new ObjectId(appointmentId),
          ...prescriptionData,
          appointmentDetails: {
            petName: appointment.petName,
            ownerName: appointment.ownerName,
            vetName: appointment.vetName,
            date: appointment.date,
          },
          createdAt: new Date(),
        };

        const result = await db
          .collection("prescriptions")
          .insertOne(prescription);

        // Update appointment with prescription reference
        await appointmentCollection.updateOne(
          { _id: new ObjectId(appointmentId) },
          {
            $set: {
              hasPrescription: true,
              prescriptionId: result.insertedId,
            },
          }
        );

        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Add endpoint for saving PDF data
    app.patch("/prescriptions/:appointmentId/pdf", async (req, res) => {
      try {
        const { appointmentId } = req.params;
        const { pdfData } = req.body;

        await db
          .collection("prescriptions")
          .updateOne(
            { appointmentId: new ObjectId(appointmentId) },
            { $set: { pdfData } }
          );

        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Get prescription by appointment ID
    app.get("/prescriptions/:appointmentId/pdf", async (req, res) => {
      try {
        const { appointmentId } = req.params;

        // Get both prescription and appointment data
        const prescription = await db.collection("prescriptions").findOne({
          appointmentId: new ObjectId(appointmentId),
        });

        // Get appointment details
        const appointment = await appointmentCollection.findOne({
          _id: new ObjectId(appointmentId),
        });

        if (!prescription || !prescription.pdfData) {
          return res
            .status(404)
            .json({ message: "Prescription PDF not found" });
        }

        // Send both prescription and appointment data
        res.json({
          pdfData: prescription.pdfData,
          appointment: {
            petName: appointment.petName,
            ownerName: appointment.ownerName,
            vetName: appointment.vetName,
            date: appointment.date,
          },
        });
      } catch (error) {
        console.error("Error fetching prescription:", error);
        res.status(500).json({ message: error.message });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

// Add error handling for the server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Start the server only after connecting to MongoDB
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Pawfect Server");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
