import { Link } from "react-router-dom";
import authStorage from "../../auth/services/authStorage";

type HeaderProps = {
  withBackButton?: string
  withAddButton?: boolean
}

export const Header = (props: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-full shadow-md px-[1em] flex justify-between items-center p-[1em] bg-white">
      <div className="w-[6em] flex">
        {(props.withBackButton) &&
            <Link to={props.withBackButton}
                  data-testid="backBtn"
                  className="text-[0.875em] font-medium text-purple-900 bg-gray-200 px-[1em] py-[0.5em] cursor-pointer">&#11164;&nbsp; Back</Link>
        }
      </div>
      <h1 className="font-bold text-[1.5em] text-purple-900">Todo</h1>
      <div className="w-[6em] flex justify-end">
        {props.withAddButton &&
            <Link to="/add"
                  data-testid="addBtn"
                  className="text-[0.875em] font-medium text-white bg-purple-900 px-[1em] py-[0.5em] cursor-pointer">Add</Link>
        }
        {authStorage.isUserHasAccessToken() &&
            <a href="/auth/login"
               onClick={authStorage.removeUser}
               data-testid="logoutBtn"
               className="text-[0.875em] font-medium text-purple-900 bg-gray-200 px-[1em] py-[0.5em] cursor-pointer">Logout</a>
        }
      </div>
    </header>
  )
}