import Image from "next/image";

export default function Attributes() {
  return (
    <div className={`bg-[url('/background.jpg')] bg-no-repeat bg-cover flex flex-col items-center justify-center min-h-screen py-2`}>
      <span><Image src="/singleplayer.png" alt="Credits" width={50} height={50}></Image><a href="https://www.flaticon.com/free-icons/internet" title="internet icons">Internet icons created by Freepik - Flaticon</a></span>
      <span><Image src="/internet.png" alt="Credits" width={50} height={50}></Image><a href="https://www.flaticon.com/free-icons/person" title="person icons">Person icons created by Freepik - Flaticon</a></span>
    </div>  
  );
}
