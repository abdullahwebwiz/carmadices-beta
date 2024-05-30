const User = require("../models/user.model.js");
const Order = require("../models/order.model.js"); // Adjust the path based on your project structure
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticateToken.js");

// Input validation
const validateInput = (firstName, email, password, phone) => {
  // Validate firstName
  const nameRegex = /^[a-zA-Z]*$/; // Regex to allow only alphabets
  if (
    !firstName ||
    typeof firstName !== "string" ||
    !nameRegex.test(firstName)
  ) {
    throw new Error("Invalid first name");
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error("Invalid email");
  }

  // Validate password
  if (!password || typeof password !== "string" || password.length < 8) {
    throw new Error("Invalid password (minimum 8 characters)");
  }

  // Validate phone
  const phoneRegex = /^\+?(\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  if (!phone || !phoneRegex.test(phone)) {
    throw new Error("Invalid phone number");
  }
};

// Functions for generating verification token
const generateVerificationToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Function to send verification email
const sendVerificationEmail = (email, verificationToken) => {
  // const verificationLink = `${process.env.BASE_URL}/user/verify/${verificationToken}`;
  const verificationLink = `${"https://mycarmedics.com:8080"}/user/verify/${verificationToken}`;

  console.log(
    `Sending verification email to ${email}. Verification Link: ${verificationLink}`
  );
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: "noreply@favelahits.com",
    to: email,
    subject: "Verify Your Email address",
    html: `<p>Please click <a href="${verificationLink}">here</a> to verify your account email.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error occurred while sending email to ${email}:`, error);
    } else {
      console.log(`Email sent to ${email}:`, info.response);
    }
  });
};

// Function to create New User
const createUser = async (req, res) => {
  try {
    const { firstName, email, password, phone, shippingAddress } = req.body;
    const verificationToken = generateVerificationToken(email);

    // Validate input
    validateInput(firstName, email, password, phone);

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        status: "FAILED",
        message: "User with this email already exists!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      email,
      password: hashedPassword,
      phone,
      shippingAddress,
      verificationToken,
    });
    await newUser.save();

    // Send verification email
    sendVerificationEmail(email, verificationToken);

    return res.json({
      status: "SUCCESS",
      message: "Signup successful. Please email inbox for verification.",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "FAILED",
      message: "An error occurred during user creation.",
    });
  }
};

// Function to login user
const loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log("Email:", email);
  console.log("Password:", password);

  if (!email || !password) {
    return res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else {
    User.findOne({ email })
      .then((user) => {
        console.log("User found:", user);
        if (!user) {
          return res.json({
            status: "FAILED",
            message: "Invalid email or password",
          });
        }

        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (isMatch) {
              // Generate token
              const tokenPayload = {
                userId: user._id,
                isAdmin: user.isAdmin, // Include isAdmin field in token payload
                isProvider: user.isProvider, // Include isProvider field in token payload
              };

              const token = jwt.sign(
                tokenPayload,
                process.env.JWT_SECRET,
                { expiresIn: "1024h" } // Token expires in 1024h
              );

              res.json({
                status: "SUCCESS",
                message: "Signin successful",
                token: token, // Send token back to client
                data: {
                  userId: user._id,
                  email: user.email,
                  address: user.shippingAdress,
                  isVerified: user.isVerified,
                  isAdmin: user.isAdmin,
                  isProvider: user.isProvider,
                },
              });
            } else {
              res.json({
                status: "FAILED",
                message: "Invalid email or password",
              });
            }
          })
          .catch((err) => {
            console.error("Error finding user:");
            console.error(err);
            res.json({
              status: "FAILED",
              message: "An error occurred while comparing passwords",
            });
          });
      })
      .catch((err) => {
        console.error(err);
        res.json({
          status: "FAILED",
          message: "An error occurred while finding user",
        });
      });
  }
}; 

const fetchUser = async (req, res) => { 
  try {
    const userId = req.user._id; // Get the user ID from the validated token
    const user = await User.findById(userId).select("-password"); // Exclude password from the query result
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    res.status(200).json({ status: "SUCCESS", user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




// Fetch all users
const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ status: "SUCCESS", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: "ERROR", message: "Failed to fetch users" });
  }
};

// Fetch all users that are providers
const fetchProviders = async (req, res) => {
  try {
    // Query the database for users with isProvider set to true
    const providers = await User.find({ isProvider: true }).select("-password"); // Exclude the password field from the result
    res.status(200).json({ status: "SUCCESS", providers });
  } catch (error) {
    console.error("Error fetching providers:", error);
    res
      .status(500)
      .json({ status: "ERROR", message: "Failed to fetch providers" });
  }
};

// Function to verify email and change isVerified to true
const verifyEmail = async (req, res) => {
  const token = req.params.token; // Access token from request params
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    // Logic to update user status in the database
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { isVerified: true } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.redirect("/verification-success"); // Redirect to a success page
  } catch (error) {
    console.error("Token verification failed:", error);
    if (error.name === "MongooseError") {
      return res
        .status(500)
        .json({ message: "Internal server error during database operation" });
    }
    res.status(400).json({ message: "Invalid token" });
  }
};

// Function to update profile data
const updateUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ status: "ERROR", message: "Unauthorized" });
    }

    console.log("Request body:", req.body);
    const { email, firstName, phone, shippingAddress } = req.body; // Corrected property name here
    const userId = req.user._id; // Get the user ID from the validated token

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, firstName, phone, shippingAddress },
      { new: true }
    ); // Corrected property name here

    if (updatedUser) {
      const { password, isVerified, __v, ...userWithoutSensitiveData } =
        updatedUser.toObject();
      return res.status(200).json({
        status: "SUCCESS",
        message: "Profile updated successfully",
        user: userWithoutSensitiveData,
      });
    } else {
      return res
        .status(404)
        .json({ status: "ERROR", message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ status: "ERROR", message: "Failed to update profile" });
  }
};

// Function to check if a user exists by email
const userExists = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email query parameter is required." });
  }

  try {
    const user = await User.findOne({ email });
    const exists = !!user;
    return res.json({ exists });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res.status(500).json({
      message: "Internal server error while checking user existence.",
    });
  }
};

// Function to check provider availability
const isProviderAvailable = async (providerId, date) => {
  try {
    console.log("Checking availability for providerId:", providerId);
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0); // Start of day in UTC
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1); // End of day in UTC

    console.log(
      `Querying orders from ${startDate.toISOString()} to ${endDate.toISOString()} for provider ${providerId}`
    );

    // Fetch orders scheduled for the given date within the local timezone converted to UTC
    const orders = await Order.find({
      "timeSlot.serviceProvider": providerId,
      "timeSlot.scheduledDate": { $gte: startDate, $lt: endDate },
    });

    console.log("Orders found for date", date, ":", orders);

    // Define business hours
    const businessStart = 9; // 9 AM
    const businessEnd = 18; // 6 PM

    // Initialize availability array for business hours
    const availabilityArray = new Array(businessEnd - businessStart).fill(true);

    orders.forEach((order) => {
      const startHour = order.timeSlot.startHour;
      const endHour = order.timeSlot.endHour;

      // Mark all slots between startHour and endHour as unavailable
      for (let hour = startHour; hour < endHour; hour++) {
        if (hour >= businessStart && hour < businessEnd) {
          availabilityArray[hour - businessStart] = false;
        }
      }
    });

    console.log("Availability array for date", date, ":", availabilityArray);
    return availabilityArray;
  } catch (error) {
    console.error("Error checking provider availability:", error);
    throw error;
  }
};

// Function to fetch provider information for an order
const fetchProviderInfoForOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);
    console.log("Found order:", order);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentProviderId = order.serviceProvider;

    // Fetch list of all providers
    const providers = await User.find({ isProvider: true });
    console.log("Found providers:", providers);

    // Check availability for each provider
    const availableProviders = await Promise.all(
      providers.map(async (provider) => {
        const availabilityArray = await isProviderAvailable(
          provider._id,
          order.timeSlot.scheduledDate
        );
        const isAvailable = availabilityArray[order.timeSlot.startHour - 9]; // Adjust for business hours start
        return {
          providerId: provider._id,
          providerName: provider.firstName,
          isAvailable,
        };
      })
    );
    console.log("Available providers:", availableProviders);

    res.status(200).json({
      currentProviderId,
      availableProviders,
    });
  } catch (error) {
    console.error("Error fetching provider information for order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to change provider assigned to an order
const reassignProvider = async (req, res) => {
  const orderId = req.params.orderId;
  const newProviderId = req.body.providerId; // Use the correct key to access the new provider ID

  console.log("New provider ID:", newProviderId); // Log the new provider ID

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);
    console.log("Found order:", order);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order with the new provider ID
    order.timeSlot.serviceProvider = newProviderId;
    console.log("New Provider ID:", newProviderId);

    // Save the updated order
    const updatedOrder = await order.save();
    console.log("Order updated with new provider ID:", updatedOrder);

    return res.status(200).json({
      message: "Provider for order changed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error changing provider for order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to clear all timeSlots for a selected user as an admin
const clearTimeSlotsForUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear the timeSlots for the user
    user.timeSlots = [];
    await user.save();

    res.json({ message: "TimeSlots cleared successfully" });
  } catch (error) {
    console.error("Error clearing timeSlots for user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to logout user
const logoutUser = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiration = decoded.exp * 1000; // Convert to milliseconds

    await InvalidToken.create({
      token: token,
      expiresAt: new Date(expiration),
    });

    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};

module.exports = {
  createUser,
  loginUser,
  fetchUser,
  verifyEmail,
  updateUser,
  logoutUser,
  userExists,
  fetchProviders,
  isProviderAvailable,
  clearTimeSlotsForUser,
  fetchAllUsers,
  fetchProviderInfoForOrder,
  reassignProvider,
};
