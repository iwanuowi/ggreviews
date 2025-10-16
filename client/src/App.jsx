import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Games from "./pages/Games";

// login and register page
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

//
import GamePostPage from "./pages/GamePostPage";
import GameAddPage from "./pages/GameAddPage";
import GameEditPage from "./pages/GameEditPage";
import GenreAddPage from "./pages/GenrePage";
import ManageGamePage from "./pages/ManageGamePage";
import ReviewCommentsPage from "./pages/ReviewCommentsPage";
import ReviewCommentEditPage from "./pages/ReviewCommentEdtitPage";
import EditReviewPage from "./pages/EditReviewPage";
import FeedBackPage from "./pages/FeedBackPage";

function App() {
  return (
    <>
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            {/* users page */}
            <Route path="/" element={<Games />} />
            <Route path="/loginpage" element={<LoginPage />} />
            <Route path="/registerpage" element={<RegisterPage />} />
            <Route path="/GameEditPage/:id" element={<GameEditPage />} />
            <Route
              path="/reviews/:reviewId/comments"
              element={<ReviewCommentsPage />}
            />
            <Route
              path="/comments/:commentId/edit"
              element={<ReviewCommentEditPage />}
            />
            <Route path="/reviews/:id/edit" element={<EditReviewPage />} />
            <Route path="/games/:id" element={<GamePostPage />} />
            <Route path="/feedback" element={<FeedBackPage />} />

            {/* admin page */}
            <Route path="/GameAdd" element={<GameAddPage />} />
            <Route path="/genreAdd" element={<GenreAddPage />} />
            <Route path="/mangeGame" element={<ManageGamePage />} />
            <Route
              path="/reviews/:reviewId/comments"
              element={<ReviewCommentsPage />}
            />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </>
  );
}

export default App;
