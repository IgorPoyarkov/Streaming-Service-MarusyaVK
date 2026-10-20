import { Link, useNavigate } from "react-router-dom";
import UserField from "./UserField";
import { useLogoutMutation } from "../../services/users/users.api";
import { useQueryClient } from "@tanstack/react-query";


interface UserInfoProps {}

const UserInfo = ({}: UserInfoProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useLogoutMutation();

  function heandlerLogout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    logout(undefined, {
      onSuccess: () => {
        queryClient.setQueryData(["profileUser"], null);
        queryClient.invalidateQueries({ queryKey: ["profileUser"] });
        queryClient.invalidateQueries({ queryKey: ["favoriteMovies"] });
        queryClient.invalidateQueries({ queryKey: ["infiniteFavorites"] });

        navigate("/");
      },
      onError: (error) => {
        alert(`Не удалось выйти из аккаунта: ${error.message}`);
      },
    });
  }

  return (
    <div className="user-info">
      <UserField />
      <Link
        className="user-field__link"
        to="/"
        onClick={isPending ? undefined : heandlerLogout}
        style={{
          pointerEvents: isPending ? "none" : "auto",
          opacity: isPending ? 0.5 : 1,
        }}
      >
        {isPending ? "Выход..." : "Выйти из аккаунта"}
      </Link>
    </div>
  );
};

export default UserInfo;
