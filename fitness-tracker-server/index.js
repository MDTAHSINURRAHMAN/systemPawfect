const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.bpnbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Store ID: pawfe679fae25324c8
// Store Password (API/Secret Key): pawfe679fae25324c8@ssl

// Merchant Panel URL: https://sandbox.sslcommerz.com/manage/ (Credential as you inputted in the time of registration)

// Store name: testpawfetb8g
// Registered URL: www.pawfect.com
// Session API to generate transaction: https://sandbox.sslcommerz.com/gwprocess/v3/api.php
// Validation API: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?wsdl
// Validation API (Web Service) name: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php

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
    // Connect the client to the server
    // await client.connect();
    // console.log("Connected to MongoDB");

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
        const { price, volunteerId, slotId } = req.body;

        // Update volunteer's availableDays with booking info
        await volunteerCollection.updateOne(
          { _id: new ObjectId(volunteerId), "availableDays.slotId": slotId },
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
        // Get tran_id from either body or query params
        const tran_id = req.body.tran_id || req.query.tran_id;
        console.log("Success payment data received:", { ...req.body, tran_id });

        if (!tran_id) {
          console.error("No transaction ID found in success request");
          return res.redirect("http://localhost:5173/payment/error");
        }

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

        console.log("Payment marked as completed:", tran_id);

        if (result.modifiedCount === 0) {
          console.error("No payment found to update:", tran_id);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
