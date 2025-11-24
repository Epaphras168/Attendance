import React from "react";
import { useData } from "../contexts/DataContext";
const AttendanceTable = ({
  records,
  showClass = false
}) => {
  const {
    students,
    classes
  } = useData();
  // Helper function to get student name
  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : "Unknown Student";
  };
  // Helper function to get class name
  const getClassName = studentId => {
    const student = students.find(s => s.id === studentId);
    if (!student) return "Unknown Class";
    const cls = classes.find(c => c.id === student.class_id);
    return cls ? cls.name : "Unknown Class";
  };
  return <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            {showClass && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check In
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check Out
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.length > 0 ? records.map(record => <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getStudentName(record.student_id)}
                </td>
                {showClass && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getClassName(record.student_id)}
                  </td>}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.time_in}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.time_out || "Not checked out"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.time_out ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {record.time_out ? "Complete" : "In Progress"}
                  </span>
                </td>
              </tr>) : <tr>
              <td colSpan={showClass ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                No attendance records found
              </td>
            </tr>}
        </tbody>
      </table>
    </div>;
};
export default AttendanceTable;