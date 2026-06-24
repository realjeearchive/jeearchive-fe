const str = "4";
try {
  console.log("JSON.parse:", JSON.parse(str), "typeof:", typeof JSON.parse(str));
} catch(e) {
  console.log("Error:", e.message);
}
