import React from "react";

const SignIn = () => {
  return (
      <div className="w-full max-w-sm mx-auto  bg-white shadow-equel rounded-2xl shadow-purple-300 p-3">
        <form className="bg-white shadow-equal rounded-lg px-8 pt-6 pb-8 mb-4">
          
          <div className="mb-4">
            <input
              className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-4">
            <input
              className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-purple-800 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
              type="button">
              Sign In
            </button>
          </div>
        </form>
      </div>
  );
};

export default SignIn;
