"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import {
  getStudentDueErrors,
  getStudentErrorById,
  getStudentErrors,
  getStudentLessons,
  getStudentModuleStats,
  LessonItem,
} from "@/lib/student-data-provider"
import { ErrorItem } from "@/lib/sample-data"

export type StudentItem = {
  id: string
  name: string
  targetScore?: number
  avatar?: string
}

export const defaultStudents: StudentItem[] = [
  { id: "std-001", name: "李尚达", targetScore: 142 },
  { id: "std-002", name: "徐同学", targetScore: 125 },
]

type StudentContextType = {
  students: StudentItem[]
  currentStudent: StudentItem
  setCurrentStudentId: (id: string) => void
  addStudent: (student: Omit<StudentItem, "id">) => void
  studentErrors: ErrorItem[]
  studentLessons: LessonItem[]
  studentDueErrors: ErrorItem[]
  studentModuleStats: ReturnType<typeof getStudentModuleStats>
  getErrorById: (id: string) => ErrorItem | undefined
}

const StudentContext = createContext<StudentContextType | null>(null)

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<StudentItem[]>(defaultStudents)
  const [currentId, setCurrentId] = useState<string>("std-001")

  useEffect(() => {
    const savedId = localStorage.getItem("mathex_active_student_id")
    if (savedId && defaultStudents.some((s) => s.id === savedId)) {
      setCurrentId(savedId)
    }
  }, [])

  const setCurrentStudentId = (id: string) => {
    setCurrentId(id)
    localStorage.setItem("mathex_active_student_id", id)
  }

  const addStudent = (newStudent: Omit<StudentItem, "id">) => {
    const id = `std-${Date.now().toString().slice(-4)}`
    const created = { id, ...newStudent }
    setStudents((prev) => [...prev, created])
    setCurrentStudentId(id)
  }

  const currentStudent =
    students.find((s) => s.id === currentId) || students[0] || defaultStudents[0]

  const studentErrors = getStudentErrors(currentStudent.id)
  const studentLessons = getStudentLessons(currentStudent.id)
  const studentDueErrors = getStudentDueErrors(currentStudent.id)
  const studentModuleStats = getStudentModuleStats(currentStudent.id)
  const getErrorById = (id: string) => getStudentErrorById(currentStudent.id, id)

  return (
    <StudentContext.Provider
      value={{
        students,
        currentStudent,
        setCurrentStudentId,
        addStudent,
        studentErrors,
        studentLessons,
        studentDueErrors,
        studentModuleStats,
        getErrorById,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const ctx = useContext(StudentContext)
  if (!ctx) {
    const fallbackId = "std-001"
    return {
      students: defaultStudents,
      currentStudent: defaultStudents[0],
      setCurrentStudentId: () => {},
      addStudent: () => {},
      studentErrors: getStudentErrors(fallbackId),
      studentLessons: getStudentLessons(fallbackId),
      studentDueErrors: getStudentDueErrors(fallbackId),
      studentModuleStats: getStudentModuleStats(fallbackId),
      getErrorById: (id: string) => getStudentErrorById(fallbackId, id),
    }
  }
  return ctx
}
