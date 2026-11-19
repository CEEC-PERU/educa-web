import React from "react";
import UserCreationTabs from "@/components/users/UserCreationTabs";

interface UserFormProps {
  roleId: number;
  activeEnterpriseId?: number;
  activeEnterpriseName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ roleId, activeEnterpriseId, activeEnterpriseName, onClose, onSuccess }) => (
  <UserCreationTabs
    roleId={roleId}
    manualEnterpriseId={activeEnterpriseId}
    manualEnterpriseName={activeEnterpriseName}
    canSelectRole
    canSelectEnterprise
    onClose={onClose}
    onSuccess={onSuccess}
  />
);

export default UserForm;
