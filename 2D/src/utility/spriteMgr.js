
export async function loadFromURL(url) {
    var res = await fetch(url);
    let json = await res.json();
    return json;
}
