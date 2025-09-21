export default function buildUrl(txt) {
  return txt.split(" ").join("-").replace(/\//g, "-");
}
