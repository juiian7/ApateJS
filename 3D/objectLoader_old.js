function loadObj(text) {
    let lines = text.split('\n');
    let points = [];
    let normals = [];
    let textures = [];

    let vertices = [];

    for (let i = 0; i < lines.length; i++) {

        let lineArgs = lines[i].split(' ');
        if (lineArgs[0] == 'v') {
            points.push([lineArgs[1], lineArgs[2], lineArgs[3]])
        }
        if (lineArgs[0] == 'vn') {
            normals.push([lineArgs[1], lineArgs[2], lineArgs[3]])
        }
        if (lineArgs[0] == 'vt') {
            textures.push([lineArgs[1], lineArgs[2]])
        }

        if (lineArgs[0] == 'f') {


            /*
            vertices = [
                px,py,pz,
                nx,ny,nz
                xt,yt,
                .
                .
                .
            ]
            f point1/texcoord1/normal1 point2/texcoord2/normal2 126/148/130
               ^
            points[125]    textures    normals

            
            points = normals = textures = [
                [x, y, z],
                [x, y, z],
                .
                . zuerst point dann texture dann normal !!!
                . lol es geht lol
            ]
            */
            let comp1 = lineArgs[1].split('/');
            let comp2 = lineArgs[2].split('/');
            let comp3 = lineArgs[3].split('/');

            let point1 = comp1[0];
            let point2 = comp2[0];
            let point3 = comp3[0];

            let text1 = comp1[1];
            let text2 = comp2[1];
            let text3 = comp3[1];

            let normal1 = comp1[2];
            let normal2 = comp1[2];
            let normal3 = comp1[2];


            // Component 1
            let data = points[point1 - 1];
            for (let i = 0; i < data.length; i++) {
                vertices.push(data[i]);
            }
            data = normals[normal1 - 1];
            for (let i = 0; i < data.length; i++) {
                vertices.push(data[i]);
            }
            data = textures[text1 - 1];
            for (let i = 0; i < data.length; i++) {
                vertices.push(data[i]);
            }

            // Component 2
            data = points[point2 - 1];
            for (let i = 0; i < data.length; i++) {
                vertices.push(data[i]);
            }
            data = normals[normal2 - 1];
            for (let i = 0; i < data.length; i++) {
                vertices.push(data[i]);
            }
            data = textures[text2 - 1];
            for (let i = 0; i < data.length; i++) {
                vertices.push(data[i]);
            }

            // Component 3
            data = points[point3 - 1];
            for (let i = 0; i < data.length; i++) {
                vertices.push(data[i]);
            }
            data = normals[normal3 - 1];
            for (let i = 0; i < data.length; i++) {
                vertices.push(data[i]);
            }
            data = textures[text3 - 1];
            for (let i = 0; i < data.length; i++) {
                vertices.push(data[i]);
            }
            //vertices.push(points[point1 - 1], points[point2 - 1], points[point3 - 1]);
            //vertices.push(normals[normal1 - 1], normals[normal2 - 1], normals[normal3 - 1])
        }
    }

    return vertices;
}