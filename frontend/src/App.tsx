import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <MainLayout>
      {/* Tạm thời để một dòng chữ để test, sau này sẽ nhét file Dashboard vào đây */}
      <div className="p-10">
        <h2 className="text-2xl font-bold text-slate-800">
          Xin chào, đây là vùng nội dung!
        </h2>
      </div>
    </MainLayout>
  );
}

export default App;
