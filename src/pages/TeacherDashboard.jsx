import React from "react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import AttendanceTable from "../components/AttendanceTable";

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const { students, classes, attendance } = useData();

  // Teacher's class name from user
  const teacherClassName = currentUser.class_name;

  // Find the class object that matches the teacher's class_name
  const teacherClass = classes.find(c => c.name === teacherClassName);

  // Now filter students by classId
  const classStudents = teacherClass
    ? students.filter(student => student.class_id === teacherClass.id)
    : [];

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter(record => {
    const student = students.find(s => s.id === record.student_id);
    return record.date === today && student?.class_id === teacherClass?.id;
  });

  const presentToday = new Set(todayAttendance.map(record => record.student_id)).size;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
        Teacher Dashboard
      </h1>
      <p className="mt-1 text-sm sm:text-base text-gray-600">
        Welcome back, {currentUser.name}
      </p>

      {teacherClass ? (
        <>
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">{teacherClass.name}</h2>
            <p className="text-sm text-gray-600">{classStudents.length} students enrolled</p>
          </div>

          {/* Stats cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Students in Class</dt>
                <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
                  {classStudents.length}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Students Present Today</dt>
                <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
                  {presentToday} / {classStudents.length}
                </dd>
              </div>
            </div>
          </div>

          {/* Attendance table */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Today's Attendance</h2>
            <div className="overflow-x-auto">
              <AttendanceTable records={todayAttendance} readOnly />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <h3 className="text-sm font-medium text-yellow-800">No class assigned</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You haven't been assigned to a class yet. Please contact the administrator.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students List */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10">Students</h1>
      <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {classStudents.length > 0 ? (
            classStudents.map((student) => (
              <li key={student.id} className="px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-900">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500">Class: {teacherClassName}</p>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    {/* Buttons (hidden for now) */}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 text-center text-gray-500">No students found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TeacherDashboard;
