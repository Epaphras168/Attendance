import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import QRGenerator from "../components/QRGenerator";
import StudentForm from "../components/StudentForm";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import SearchBar from "../components/ui/Search";
import { supabase } from "../lib/supabaseClient";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showQRCode, setShowQRCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch students and classes from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*");
      if (studentsError) console.error(studentsError);
      else setStudents(studentsData);

      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select("*");
      if (classesError) console.error(classesError);
      else setClasses(classesData);
    };

    fetchData();
  }, []);

  // Add new student
  const handleAddStudent = async (formData) => {
    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          name: formData.name,
          class_id: formData.classId,
          qr_code: `student-${crypto.randomUUID()}`,
        },
      ])
      .select();

    if (error) console.error(error);
    else {
      setStudents([...students, data[0]]);
      setIsAddingStudent(false);
    }
  };

  // Update student
  const handleUpdateStudent = async (formData) => {
    const { data, error } = await supabase
      .from("students")
      .update({
        name: formData.name,
        class_id: formData.classId,
      })
      .eq("id", editingStudent.id)
      .select();

    if (error) console.error(error);
    else {
      setStudents(
        students.map((s) => (s.id === editingStudent.id ? data[0] : s))
      );
      setEditingStudent(null);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) console.error(error);
    else setStudents(students.filter((s) => s.id !== id));
  };


  // Regenerate QR code
const handleRegenerateQRCode = async (studentId) => {
  try {
    const newQRCode = `student-${crypto.randomUUID()}`;

    const { data, error } = await supabase
      .from("students")
      .update({ qr_code: newQRCode })
      .eq("id", studentId)
      .select();

    if (error) throw error;

    // Update local state
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === studentId ? data[0] : s))
    );

    // Update modal if open
    if (showQRCode?.id === studentId) {
      setShowQRCode(data[0]);
    }

    alert("QR Code regenerated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to regenerate QR code");
  }
};


  // Helper function to get class name
  const getClassName = (classId) => {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : "Unknown Class";
  };

  // Filter students by name
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Students</h1>
        <SearchBar
          placeholder="Search students..."
          onSearch={(query) => setSearchQuery(query)}
        />
        <Button
          onClick={() => setIsAddingStudent(true)}
          variant="primary"
          size="sm"
        >
          <PlusIcon className="w-4 h-4 mr-1" /> Add Student
        </Button>
      </div>

      {/* Add/Edit Student Form */}
      {(isAddingStudent || editingStudent) && (
        <div className="mt-6 bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h2>
          <StudentForm
            onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
            initialData={editingStudent}
            onCancel={() => {
              setIsAddingStudent(false);
              setEditingStudent(null);
            }}
          />
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Student QR Code
            </h2>
            <QRGenerator
              studentId={showQRCode.id}
              qrCode={showQRCode.qr_code}
              name={showQRCode.name}
              onRegenerate={handleRegenerateQRCode}
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setShowQRCode(null)}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <li key={student.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Class: {getClassName(student.class_id)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setShowQRCode(student)}
                      variant="outline"
                      size="sm"
                    >
                      View QR
                    </Button>
                    <Button
                      onClick={() => setEditingStudent(student)}
                      variant="secondary"
                      size="sm"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteStudent(student.id)}
                      variant="danger"
                      size="sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-4 text-center text-gray-500">
              No students found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageStudents;
