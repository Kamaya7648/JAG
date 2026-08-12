import "./AddVehicle.css";
import { useState } from "react";

import {
  FaCar,
  FaUser,
  FaHistory,
  FaExclamationTriangle,
  FaPlus,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

function AddVehicle({ onCancel }) {

  const emptyService = {
    date: "",
    type: "",
    description: "",
    mileage: "",
    cost: "",
  };

  const [vehicle, setVehicle] = useState({
    registrationNumber: "",
    vehicleType: "",
    make: "",
    model: "",
    year: "",
    colour: "",
    mileage: "",
    vin: "",
    engineNumber: "",
    fuelType: "",

    ownerName: "",
    contactNumber: "",
    email: "",
    address: "",

    problems: [],
    problemDescription: "",
    notes: "",
  });

  const [serviceHistory, setServiceHistory] = useState([]);

  const [message, setMessage] = useState("");

  /* ================= CHANGE INPUT ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setVehicle((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  /* ================= PROBLEMS ================= */

  const problems = [
    "Engine",
    "Transmission",
    "Brakes",
    "Electrical",
    "Air Conditioning",
    "Suspension",
    "Body / Exterior",
    "Other",
  ];

  const handleProblemChange = (problem) => {

    setVehicle((previous) => {

      const alreadySelected =
        previous.problems.includes(problem);

      return {
        ...previous,

        problems: alreadySelected
          ? previous.problems.filter(
              (item) => item !== problem
            )
          : [...previous.problems, problem],
      };
    });
  };

  /* ================= SERVICE HISTORY ================= */

  const addService = () => {

    setServiceHistory((previous) => [
      ...previous,
      { ...emptyService },
    ]);
  };

  const updateService = (index, field, value) => {

    setServiceHistory((previous) =>
      previous.map((service, serviceIndex) =>
        serviceIndex === index
          ? {
              ...service,
              [field]: value,
            }
          : service
      )
    );
  };

  const removeService = (index) => {

    setServiceHistory((previous) =>
      previous.filter(
        (_, serviceIndex) => serviceIndex !== index
      )
    );
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {

    e.preventDefault();

    if (
      !vehicle.registrationNumber ||
      !vehicle.make ||
      !vehicle.model ||
      !vehicle.ownerName ||
      !vehicle.contactNumber
    ) {
      setMessage(
        "Please fill in all required vehicle and owner details."
      );

      return;
    }

    const vehicleRecord = {
      ...vehicle,
      serviceHistory,
      createdAt: new Date().toISOString(),
    };

    console.log("Vehicle Record:", vehicleRecord);

    setMessage(
      `Vehicle ${vehicle.registrationNumber} added successfully.`
    );
  };

  /* ================= CANCEL ================= */

  const handleCancel = () => {

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <main className="add-vehicle-page">

      {/* ================= HEADER ================= */}

      <div className="add-page-header">

        <div>

          <h1>Add New Vehicle</h1>

          <p>
            Create a complete vehicle record for the garage
          </p>

        </div>

      </div>


      <form onSubmit={handleSubmit}>


        {/* ================================================= */}
        {/* VEHICLE INFORMATION */}
        {/* ================================================= */}

        <section className="vehicle-form-card">

          <div className="vehicle-section-title">

            <div className="vehicle-section-icon">
              <FaCar />
            </div>

            <div>
              <h2>Vehicle Information</h2>

              <p>
                Basic identification and technical details
              </p>
            </div>

          </div>


          <div className="vehicle-form-grid">

            <div className="vehicle-field">

              <label>
                Registration Number <b>*</b>
              </label>

              <input
                type="text"
                name="registrationNumber"
                placeholder="e.g. WP ABC-1234"
                value={vehicle.registrationNumber}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field">

              <label>Vehicle Type</label>

              <select
                name="vehicleType"
                value={vehicle.vehicleType}
                onChange={handleChange}
              >

                <option value="">
                  Select type
                </option>

                <option value="Car">
                  Car
                </option>

                <option value="Van">
                  Van
                </option>

                <option value="SUV">
                  SUV
                </option>

                <option value="Truck">
                  Truck
                </option>

                <option value="Motorcycle">
                  Motorcycle
                </option>

              </select>

            </div>


            <div className="vehicle-field">

              <label>
                Make <b>*</b>
              </label>

              <input
                type="text"
                name="make"
                placeholder="e.g. Toyota"
                value={vehicle.make}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field">

              <label>
                Model <b>*</b>
              </label>

              <input
                type="text"
                name="model"
                placeholder="e.g. Corolla"
                value={vehicle.model}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field">

              <label>Year</label>

              <input
                type="number"
                name="year"
                placeholder="e.g. 2022"
                value={vehicle.year}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field">

              <label>Colour</label>

              <input
                type="text"
                name="colour"
                placeholder="e.g. White"
                value={vehicle.colour}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field">

              <label>Current Mileage</label>

              <input
                type="number"
                name="mileage"
                placeholder="e.g. 45000 km"
                value={vehicle.mileage}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field">

              <label>Fuel Type</label>

              <select
                name="fuelType"
                value={vehicle.fuelType}
                onChange={handleChange}
              >

                <option value="">
                  Select fuel
                </option>

                <option value="Petrol">
                  Petrol
                </option>

                <option value="Diesel">
                  Diesel
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="Electric">
                  Electric
                </option>

              </select>

            </div>


            <div className="vehicle-field">

              <label>VIN / Chassis Number</label>

              <input
                type="text"
                name="vin"
                placeholder="Vehicle identification number"
                value={vehicle.vin}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field">

              <label>Engine Number</label>

              <input
                type="text"
                name="engineNumber"
                placeholder="Engine number"
                value={vehicle.engineNumber}
                onChange={handleChange}
              />

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* OWNER INFORMATION */}
        {/* ================================================= */}

        <section className="vehicle-form-card">

          <div className="vehicle-section-title">

            <div className="vehicle-section-icon">
              <FaUser />
            </div>

            <div>

              <h2>Owner Information</h2>

              <p>
                Contact information of the vehicle owner
              </p>

            </div>

          </div>


          <div className="vehicle-form-grid">

            <div className="vehicle-field">

              <label>
                Owner Name <b>*</b>
              </label>

              <input
                type="text"
                name="ownerName"
                placeholder="Full name"
                value={vehicle.ownerName}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field">

              <label>
                Contact Number <b>*</b>
              </label>

              <input
                type="tel"
                name="contactNumber"
                placeholder="07X XXX XXXX"
                value={vehicle.contactNumber}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field">

              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="owner@email.com"
                value={vehicle.email}
                onChange={handleChange}
              />

            </div>


            <div className="vehicle-field vehicle-full">

              <label>Address</label>

              <input
                type="text"
                name="address"
                placeholder="Owner address"
                value={vehicle.address}
                onChange={handleChange}
              />

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* VEHICLE HISTORY */}
        {/* ================================================= */}

        <section className="vehicle-form-card">

          <div className="vehicle-section-title">

            <div className="vehicle-section-icon">
              <FaHistory />
            </div>

            <div>

              <h2>Vehicle Service & Repair History</h2>

              <p>
                Record previous services, repairs and maintenance
              </p>

            </div>

          </div>


          {serviceHistory.length === 0 && (

            <div className="empty-history">

              <FaHistory />

              <p>
                No previous service records added.
              </p>

              <span>
                Add the vehicle's previous service or repair history below.
              </span>

            </div>

          )}


          {serviceHistory.map((service, index) => (

            <div
              className="service-record"
              key={index}
            >

              <div className="service-record-header">

                <strong>
                  Previous Record {index + 1}
                </strong>

                <button
                  type="button"
                  className="remove-service"
                  onClick={() => removeService(index)}
                >
                  <FaTrash />
                </button>

              </div>


              <div className="service-grid">

                <div className="vehicle-field">

                  <label>Date</label>

                  <input
                    type="date"
                    value={service.date}
                    onChange={(e) =>
                      updateService(
                        index,
                        "date",
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="vehicle-field">

                  <label>Service / Repair Type</label>

                  <select
                    value={service.type}
                    onChange={(e) =>
                      updateService(
                        index,
                        "type",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select type
                    </option>

                    <option value="General Service">
                      General Service
                    </option>

                    <option value="Oil Change">
                      Oil Change
                    </option>

                    <option value="Brake Service">
                      Brake Service
                    </option>

                    <option value="Engine Repair">
                      Engine Repair
                    </option>

                    <option value="Electrical Repair">
                      Electrical Repair
                    </option>

                    <option value="AC Service">
                      AC Service
                    </option>

                    <option value="Other Repair">
                      Other Repair
                    </option>

                  </select>

                </div>


                <div className="vehicle-field">

                  <label>Mileage</label>

                  <input
                    type="number"
                    placeholder="km"
                    value={service.mileage}
                    onChange={(e) =>
                      updateService(
                        index,
                        "mileage",
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="vehicle-field">

                  <label>Cost</label>

                  <input
                    type="number"
                    placeholder="Rs."
                    value={service.cost}
                    onChange={(e) =>
                      updateService(
                        index,
                        "cost",
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="vehicle-field vehicle-full">

                  <label>
                    Service / Repair Description
                  </label>

                  <input
                    type="text"
                    placeholder="What was done to the vehicle?"
                    value={service.description}
                    onChange={(e) =>
                      updateService(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

            </div>

          ))}


          <button
            type="button"
            className="add-history-button"
            onClick={addService}
          >

            <FaPlus />

            Add Previous Record

          </button>

        </section>


        {/* ================================================= */}
        {/* KNOWN PROBLEMS */}
        {/* ================================================= */}

        <section className="vehicle-form-card">

          <div className="vehicle-section-title">

            <div className="vehicle-section-icon problem-icon">
              <FaExclamationTriangle />
            </div>

            <div>

              <h2>Known Problems & Issues</h2>

              <p>
                Record existing problems or known faults
              </p>

            </div>

          </div>


          <div className="problem-list">

            {problems.map((problem) => (

              <label
                className="problem-option"
                key={problem}
              >

                <input
                  type="checkbox"
                  checked={vehicle.problems.includes(problem)}
                  onChange={() =>
                    handleProblemChange(problem)
                  }
                />

                <span>
                  {problem}
                </span>

              </label>

            ))}

          </div>


          <div className="vehicle-field problem-description">

            <label>
              Problem Details
            </label>

            <textarea
              name="problemDescription"
              placeholder="Describe any known problems, unusual noises, warning lights, previous faults, damage, etc."
              value={vehicle.problemDescription}
              onChange={handleChange}
            />

          </div>

        </section>


        {/* ================================================= */}
        {/* NOTES */}
        {/* ================================================= */}

        <section className="vehicle-form-card">

          <div className="vehicle-section-title">

            <div>
              <h2>Additional Notes</h2>

              <p>
                Add any other important information about this vehicle
              </p>
            </div>

          </div>


          <div className="vehicle-field">

            <textarea
              className="notes-area"
              name="notes"
              placeholder="Additional information, special instructions, customer requests..."
              value={vehicle.notes}
              onChange={handleChange}
            />

          </div>

        </section>


        {/* ================================================= */}
        {/* ACTIONS */}
        {/* ================================================= */}

        <div className="vehicle-form-actions">

          {message && (

            <p
              className={
                message.includes("successfully")
                  ? "vehicle-success"
                  : "vehicle-error"
              }
            >
              {message}
            </p>

          )}


          <div className="vehicle-action-buttons">

            <button
              type="button"
              className="vehicle-cancel"
              onClick={handleCancel}
            >

              <FaTimes />

              Cancel

            </button>


            <button
              type="submit"
              className="vehicle-submit"
            >

              <FaPlus />

              Add Vehicle

            </button>

          </div>

        </div>

      </form>

    </main>
  );
}

export default AddVehicle;