import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";

import { Employee } from "../../types/types";
import EmployeeDataTable from "./EmployeeDataTable";
import AddIcon from "@mui/icons-material/AddBox";
import ModalPortal from "../UI/ModalPortal";
import useModal from "../../hooks/useModal";
import { useState } from "react";
import EmployeeNewEditForm from "./EmployeeNewEditForm";
import DeleteModal from "../UI/DeleteModal";
import EmployeeProjects from "./EmployeeProjects";
import { useAppDispatch, useAppSelector } from "../../store/hooks/storeHooks";
import { deleteEmployee, state } from "../../store/slices/employeeSlice";

const initEmployee: Employee = {
  id: "-1",
  name: "",
  email: "",
  role: "",
};

const initModalInfo: IModalInfo = {
  type: "NEW",
  header: "New Employee",
  employee: initEmployee,
};

interface IModalInfo {
  type: string;
  header: string;
  employee: Employee;
}

const EmployeeList = () => {
  const { isShowing: showEmployeeModal, toggle: toggleEmployeeModal } =
    useModal();
  const { isShowing: showDeleteModal, toggle: toggleDeleteModal } = useModal();
  const {
    isShowing: showEmployeeProjectsModal,
    toggle: toggleEmployeeProjectsModal,
  } = useModal();

  const dispatch = useAppDispatch();
  const employeeState = useAppSelector(state);

  const [modalInfo, setModalInfo] = useState<IModalInfo>(initModalInfo);

  const onNew = () => {
    setModalInfo(initModalInfo);
    toggleEmployeeModal();
  };

  const onEdit = (selectedEmployee: Employee) => {
    setModalInfo({
      type: "UPDATE",
      header: "Update Employee",
      employee: selectedEmployee,
    });
    toggleEmployeeModal();
  };

  const onDelete = (selectedEmployee: Employee) => {
    setModalInfo({
      type: "DELETE",
      header: "Delete Employee",
      employee: selectedEmployee,
    });
    toggleDeleteModal();
  };

  const onDeleteConfirm = () => {
    if (modalInfo.employee && modalInfo.employee.id) {
      dispatch(deleteEmployee(modalInfo.employee.id));
    }
  };

  const onShowEmployeeProject = (selectedEmployee: Employee) => {
    setModalInfo({
      type: "EMPLOYEE_PROJECTS",
      header: selectedEmployee.name + "'s Projects",
      employee: selectedEmployee,
    });
    toggleEmployeeProjectsModal();
  };

  return (
    <>
      <Card sx={{ marginTop: ["40px"] }}>
        <CardHeader
          title="Employees"
          action={
            <IconButton aria-label="settings" onClick={onNew}>
              <AddIcon />
            </IconButton>
          }
        />

        <CardContent>
          <EmployeeDataTable
            employees={employeeState.employees}
            editEmployee={onEdit}
            deleteEmployee={onDelete}
            showEmployeeProject={onShowEmployeeProject}
          />
        </CardContent>
      </Card>

      <ModalPortal
        header={modalInfo.header}
        showModal={showEmployeeModal}
        closeModal={toggleEmployeeModal}
      >
        <EmployeeNewEditForm
          type={modalInfo.type}
          employee={modalInfo.employee}
          close={toggleEmployeeModal}
        />
      </ModalPortal>

      <ModalPortal
        header={modalInfo.header}
        showModal={showDeleteModal}
        closeModal={toggleDeleteModal}
      >
        <DeleteModal
          type="Employee"
          name={modalInfo.employee.name || ""}
          confirmMethod={onDeleteConfirm}
          closeModal={toggleDeleteModal}
        />
      </ModalPortal>

      <ModalPortal
        header={modalInfo.header}
        showModal={showEmployeeProjectsModal}
        closeModal={toggleEmployeeProjectsModal}
      >
        <EmployeeProjects
          employee={modalInfo.employee}
          close={toggleEmployeeProjectsModal}
        />
      </ModalPortal>
    </>
  );
};
export default EmployeeList;
