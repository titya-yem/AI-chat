import ReviewList from './components/reviews/ReviewList';

const App = () => {
  return (
    <div className="p-4 h-screen">
      <ReviewList productId={4} />
    </div>
  );
};

export default App;
