// objectLoader.js

function loadObj(text) {
    let lines = text.split('\n');
    let points = [];
    let textures = [];
    let normals = [];

    let vertices = [];

    let includesNormals = false;
    let includesTextureCoords = false;

    for (let i = 0; i < lines.length; i++) {

        let lineArgs = lines[i].split(' ');
        if (lineArgs[0] == 'v') {
            points.push([lineArgs[1], lineArgs[2], lineArgs[3]])
        } else if (lineArgs[0] == 'vt') {
            textures.push([lineArgs[1], lineArgs[2]])
        } else if (lineArgs[0] == 'vn') {
            normals.push([lineArgs[1], lineArgs[2], lineArgs[3]])
        } else if (lineArgs[0] == 'f') {

            let comps = []; // f 1/2/3 1/2/3 1/2/3

            for (let i = 0; i < 3; i++) {
                comps[i] = lineArgs[i + 1].split('/');
            }

            if (comps[0].length > 2) {
                if (comps[0][2] != '') includesNormals = true;
                if (comps[0][1] != '') includesTextureCoords = true;
            }

            var data = null;
            for (let i = 0; i < 3; i++) {

                data = points[comps[i][0] - 1];
                for (let i = 0; i < data.length; i++) {
                    vertices.push(data[i]);
                }
                if (includesTextureCoords) {
                    data = textures[comps[i][1] - 1];
                    for (let i = 0; i < data.length; i++) {
                        vertices.push(data[i]);
                    }
                }
                if (includesNormals) {
                    data = normals[comps[i][2] - 1];
                    for (let i = 0; i < data.length; i++) {
                        vertices.push(data[i]);
                    }
                }
            }
        }

    }

    return {
        vertices,
        includesNormals,
        includesTextureCoords
    };
}