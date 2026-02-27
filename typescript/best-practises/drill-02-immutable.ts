type Student = {
  id: number;
  active: boolean;
};

function deactivate(
  students: readonly Student[],
  id: number
) {
  return students.map(u =>
    u.id === id ? { ...u, active: false } : u
  );
}

const students = [
  { id: 1, active: true },
  { id: 2, active: true },
];

const updated = deactivate(students, 1);

console.log(students[0].active);   
console.log(updated[0].active); 