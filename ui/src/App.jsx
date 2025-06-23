import "./App.css";
import { ArrowRight } from "lucide-react";

function App() {
  const fields = [
    {
      name: "password",
      type: "text",
      label: "Password",
      placeholder: "Enter your password",
      required: true,
    },
    {
      name: "app",
      type: "text",
      label: "App",
      placeholder: "Enter the app name",
      required: true,
    },
    {
      name: "username/email",
      type: "text",
      label: "Username/Email",
      placeholder: "Enter your username or email",
      required: true,
    },
    {
      name: "description",
      type: "text",
      label: "description",
      placeholder: "Enter any additional information",
      required: false,
    },
    {
      name: "tags",
      type: "text",
      label: "Tags",
      placeholder: "Enter tags for this entry",
      required: false,
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold dark:text-[rgba(255,255,255,0.7)] text-[rgba(100,100,100,0.5)]">Welcome to PassVault</h1>
      <p className="text-lg">Your secure password manager</p>
      <section className="mt-8 flex flex-col items-center space-y-4 border-[rgba(255,255,255,0.1)] border-1 p-6 rounded-lg shadow-xl max-w-[90%] min-w-[400px]">
        {fields.map((field) => (
          <div key={field.name} className="w-full max-w-md">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-3 py-2 border-gray-300 focus:outline-none focus:ring-1 rounded focus:ring-blue-500 bg-black/20"
            />
          </div>
        ))}
        <button className="bg-black/30 text-white w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded hover:translate-y-[5px] transition-transform border-1 border-[rgba(255,255,255,0.1)] hover:bg-black/40">
          <span>Submit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </main>
  );
}

export default App;
