import { User } from "next-auth";
import React from "react";

type Props = {
  user: User;
};

const UserAccount = ({ user }: Props) => {
  return <div>UserAccount</div>;
};

export default UserAccount;
