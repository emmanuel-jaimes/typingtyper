import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Firestore() {
  const addData = async () => {
    try {
      await addDoc(collection(db, "users"), { name: "John Doe", age: 30 });
      console.log("Document added!");
    } catch (error) {
      console.error("Error adding document");
    }
  };

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error("Error fetching data:");
    }
  };

  return (
    <div>
      <button onClick={addData}>Add Data</button>
      <button onClick={getData}>Get Data</button>
    </div>
  );
}

export default Firestore;
