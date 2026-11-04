import React from "react";
import UserCreationTabs from "@/components/users/UserCreationTabs";

interface UserFormProps {
  roleId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ roleId, onClose, onSuccess }) => (
  <UserCreationTabs
    roleId={roleId}
    canSelectRole
    canSelectEnterprise
    onClose={onClose}
    onSuccess={onSuccess}
  />
);

export default UserForm;
