import React, { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import Button from "./ui/Button";
const StudentForm = ({
  onSubmit,
  initialData = null,
  onCancel
}) => {
  const {
    classes
  } = useData();
  const [formData, setFormData] = useState({
    name: "",
    classId: ""
  });
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        classId: initialData.classId || ""
      });
    }
  }, [initialData]);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: name === "classId" ? parseInt(value) : value
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Student Name
        </label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
          Class
        </label>
        <select id="classId" name="classId" value={formData.classId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          <option value="">Select a class</option>
          {classes.map(cls => <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>)}
        </select>
      </div>
      <div className="flex space-x-3">
        <Button type="submit" variant="primary">
          {initialData ? "Update Student" : "Add Student"}
        </Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>}
      </div>
    </form>;
};
export default StudentForm;