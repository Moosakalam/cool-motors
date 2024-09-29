// import "./ListVehicle.css";
// import React, { useState } from "react";
// import axios from "axios";

// function ListVehicle() {
//   const [formData, setFormData] = useState({
//     make: "",
//     model: "",
//     year: "",
//     price: "",
//     fuelType: "",
//     transmission: "",
//     engineDisplacement: "",
//     engineType: "",
//     odometer: "",
//     ownership: "",
//     location: "",
//   });

//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const carMakes = [
//     "Toyota",
//     "Honda",
//     "Ford",
//     "Chevrolet",
//     "BMW",
//     "Mercedes-Benz",
//     "Audi",
//     "Volkswagen",
//     "Nissan",
//     "Hyundai",
//     "Kia",
//     "Mazda",
//     "Subaru",
//     "Lexus",
//     "Jaguar",
//     "Land Rover",
//     "Volvo",
//     "Tesla",
//     "Porsche",
//     "Ferrari",
//     "Lamborghini",
//   ];

//   const years = Array.from(
//     { length: new Date().getFullYear() - 1900 + 1 },
//     (_, i) => 1900 + i
//   );

//   const fuelTypes = ["petrol", "diesel", "electric", "hybrid", "CNG", "LPG"];
//   const transmissions = ["manual", "automatic"];
//   const engineTypes = [
//     "I3",
//     "I4",
//     "I5",
//     "I6",
//     "V6",
//     "V8",
//     "V10",
//     "V12",
//     "V16",
//     "W12",
//     "W16",
//     "H4",
//     "H6",
//     "Rotary",
//   ];
//   const ownerships = Array.from({ length: 10 }, (_, i) => i + 1);
//   const locations = [
//     "Mumbai",
//     "Delhi",
//     "Bangalore",
//     "Hyderabad",
//     "Chennai",
//     "Kolkata",
//     "Pune",
//     "Ahmedabad",
//     "Jaipur",
//     "Surat",
//     "Lucknow",
//     "Kanpur",
//     "Nagpur",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     // Store selected files in state
//     setSelectedFiles(Array.from(e.target.files));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formDataWithFiles = new FormData();
//       Object.keys(formData).forEach((key) => {
//         formDataWithFiles.append(key, formData[key]);
//       });

//       if (selectedFiles) {
//         // Append each selected file to the FormData
//         selectedFiles.forEach((file) => {
//           formDataWithFiles.append("images", file);
//         });
//       }

//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://127.0.0.1:5000/api/v1/vehicles/list",
//         formDataWithFiles,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setSuccess("Vehicle added successfully!");
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to add vehicle");
//       setSuccess("");
//     }
//   };

//   return (
//     <div className="vehicle-list-container">
//       <h2 className="form-title">List Vehicle</h2>
//       <form className="vehicle-form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="make">Make</label>
//           <input
//             type="text"
//             name="make"
//             list="carMakes"
//             value={formData.make}
//             onChange={handleChange}
//             required
//           />
//           <datalist id="carMakes">
//             {carMakes.map((make) => (
//               <option key={make} value={make} />
//             ))}
//           </datalist>
//         </div>

//         <div className="form-group">
//           <label htmlFor="model">Model</label>
//           <input
//             type="text"
//             name="model"
//             value={formData.model}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="year">Year</label>
//           <input
//             type="text"
//             name="year"
//             list="years"
//             value={formData.year}
//             onChange={handleChange}
//             required
//           />
//           <datalist id="years">
//             {years.map((year) => (
//               <option key={year} value={year} />
//             ))}
//           </datalist>
//         </div>

//         <div className="form-group">
//           <label htmlFor="price">Price</label>
//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="fuelType">Fuel Type</label>
//           <select
//             name="fuelType"
//             value={formData.fuelType}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Fuel Type</option>
//             {fuelTypes.map((fuel) => (
//               <option key={fuel} value={fuel}>
//                 {fuel}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label htmlFor="transmission">Transmission</label>
//           <select
//             name="transmission"
//             value={formData.transmission}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Transmission</option>
//             {transmissions.map((transmission) => (
//               <option key={transmission} value={transmission}>
//                 {transmission}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label htmlFor="engineDisplacement">Engine Displacement</label>
//           <input
//             type="number"
//             step="0.1"
//             name="engineDisplacement"
//             value={formData.engineDisplacement}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="engineType">Engine Type</label>
//           <select
//             name="engineType"
//             value={formData.engineType}
//             onChange={handleChange}
//           >
//             <option value="">Select Engine Type</option>
//             {engineTypes.map((engine) => (
//               <option key={engine} value={engine}>
//                 {engine}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label htmlFor="odometer">Odometer</label>
//           <input
//             type="number"
//             name="odometer"
//             value={formData.odometer}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="ownership">Ownership</label>
//           <input
//             type="text"
//             name="ownership"
//             list="ownerships"
//             value={formData.ownership}
//             onChange={handleChange}
//             required
//           />
//           <datalist id="ownerships">
//             {ownerships.map((num) => (
//               <option key={num} value={num} />
//             ))}
//           </datalist>
//         </div>

//         <div className="form-group">
//           <label htmlFor="location">Location</label>
//           <input
//             type="text"
//             name="location"
//             list="locations"
//             value={formData.location}
//             onChange={handleChange}
//             required
//           />
//           <datalist id="locations">
//             {locations.map((city) => (
//               <option key={city} value={city} />
//             ))}
//           </datalist>
//         </div>
//         {/* IMAGES ------------------------------------------------- */}
//         <div className="form-group">
//           <label htmlFor="file">Upload Images (up to 20)</label>
//           <input
//             type="file"
//             multiple // Enable multiple file selection
//             onChange={handleFileChange}
//             required
//             accept="image/*" // Accept only image files
//           />
//         </div>
//         {/*------------------------------------------------------------ */}
//         <button type="submit" className="submit-button">
//           Add Vehicle
//         </button>
//       </form>

//       {error && <p className="error-message">{error}</p>}
//       {success && <p className="success-message">{success}</p>}
//     </div>
//   );
// }

// export default ListVehicle;

// exports.listVehicle = catchAsyncError(async (req, res, next) => {
//   const file = req.file;

//   // const fileBuffer = await sharp(file.buffer)
//   //   .resize({ height: 1920, width: 1080, fit: "contain" })
//   //   .toBuffer();

//   // Configure the upload details to send to S3
//   const fileName = generateFileName();
//   const uploadParams = {
//     Bucket: bucketName,
//     Body: file.buffer,
//     Key: fileName,
//     ContentType: file.mimetype,
//   };

//   // Send the upload to S3
//   await s3Client.send(new PutObjectCommand(uploadParams));

//   //image url:
//   const imageUrl = `https://images-cool-motors.s3.eu-north-1.amazonaws.com/${fileName}`;

//   // Send the upload to S3
//   const newVehicle = await Vehicle.create({
//     make: req.body.make,
//     model: req.body.model,
//     year: req.body.year,
//     price: req.body.price,
//     fuelType: req.body.fuelType,
//     transmission: req.body.transmission,
//     engineDisplacement: req.body.engineDisplacement,
//     engineType: req.body.engineType,
//     odometer: req.body.odometer,
//     ownership: req.body.ownership,
//     location: req.body.location,
//     listedBy: req.user._id,
//     image: imageUrl,
//   });

//   //add vehicle to Owner's User document
//   await User.findByIdAndUpdate(req.user._id, {
//     $push: { listedVehicles: newVehicle._id },
//   });

//   res.status(201).json({
//     status: "success",
//     data: {
//       newVehicle,
//     },
//   });
// });
