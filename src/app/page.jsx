import Nav from "../components/Nav";

export default function Home() {
  return (
    <main className="">
      <Nav />
      <div className="flex min-h-screen justify-center ">
        <h1 className=" text-center lg:text-9xl md:text-7xl text-5xl m-40">
          MadFunds
        </h1>
      </div>
    </main>
  );
}
