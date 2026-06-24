"use client";

import { useState } from "react";
import { useAddressStore } from "@/hooks/addressStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

const inputClassName =
  "w-full bg-transparent border border-white/10 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-600";

export default function AddressForm() {
  const addAddress = useAddressStore((state) => state.addAddress);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: true,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const { fullName, phone, street, city, state, postalCode, country } = form;

    if (
      !fullName ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      setError("All fields are required.");
      return;
    }

    addAddress(form);

    setSuccess("Address saved successfully.");
    setForm({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: true,
    });

    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-6 md:p-8 space-y-5"
    >
      <h2 className="text-xl font-serif mb-2">Add New Address</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 block">
            Full Name
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 block">
            Phone Number
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 block">
          Street Address
        </label>
        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          placeholder="123 Main Street, Apt 4B"
          className={inputClassName}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 block">
            City
          </label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Mumbai"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 block">
            State
          </label>
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Maharashtra"
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 block">
            Postal Code
          </label>
          <input
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            placeholder="400001"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 block">
            Country
          </label>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="India"
            className={inputClassName}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-5 h-5 rounded-md border border-white/10 bg-white/[0.03] peer-checked:bg-[#d4a853] peer-checked:border-[#d4a853] transition flex items-center justify-center">
            {form.isDefault && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-black"
              >
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
        Set as default address
      </label>

      {/* Feedback Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 p-3 rounded-xl border border-green-500/15 bg-green-500/5"
          >
            <CheckCircle size={14} className="text-green-400 shrink-0" />
            <span className="text-green-400 text-sm">{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 p-3 rounded-xl border border-red-500/15 bg-red-500/5"
          >
            <AlertCircle size={14} className="text-red-400 shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        className="px-8 py-3.5 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300"
      >
        Save Address
      </button>
    </form>
  );
}
