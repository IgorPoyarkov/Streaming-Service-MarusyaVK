import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AuthModal from "./components/AuthModal/AuthModal";
import Header from "./components/Header/Header";
import Container from "./components/Container/Container";
import Footer from "./components/Footer/Footer";
import Main from "./components/Main/Main";
import HomePage from "./pages/Home/HomePage";
import MoviePage from "./pages/Movie/MoviePage";
import GenrePage from "./pages/Genres/GenrePage";
import Account from "./components/Account/Account";
import SelectedFilms from "./components/Account/SelectedFilms";
import UserInfo from "./components/Account/UserInfo";
import Genres from "./components/Genres/Genres";
import WatchingVideo from "./components/WatchingVideo/WatchingVideo";

const AppLayout = () => {
  return (
    <div className="app">
      <Container>
        <Header />

        <Main>
          <Outlet />
        </Main>

        <Footer />
      </Container>
      <AuthModal />
      <WatchingVideo />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/movie/:id", element: <MoviePage /> },
      { path: "/movie/genres", element: <GenrePage /> },
      { path: "/genres/:genre", element: <Genres /> },
      {
        path: "/account",
        element: <Account />,
        children: [
          {
            path: "",
            element: <SelectedFilms />,
          },
          {
            path: "selected",
            element: <SelectedFilms />,
          },
          {
            path: "userfield",
            element: <UserInfo />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
