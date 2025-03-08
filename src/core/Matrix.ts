import Transform from "./Transform.js";
import Vec from "./Vec.js";

type c = number;
export type Matrix = [c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c];

export function identity(): Matrix {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

export function translation(vec: Vec): Matrix {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, vec.x, vec.y, vec.z, 1];
}

export function scale(vec: Vec): Matrix {
    return [vec.x, 0, 0, 0, 0, vec.y, 0, 0, 0, 0, vec.z, 0, 0, 0, 0, 1];
}

export function rotationX(rad: number): Matrix {
    return [1, 0, 0, 0, 0, Math.cos(rad), -Math.sin(rad), 0, 0, Math.sin(rad), Math.cos(rad), 0, 0, 0, 0, 1];
}

export function rotationY(rad: number): Matrix {
    return [Math.cos(rad), 0, Math.sin(rad), 0, 0, 1, 0, 0, -Math.sin(rad), 0, Math.cos(rad), 0, 0, 0, 0, 1];
}

export function rotationZ(rad: number): Matrix {
    return [Math.cos(rad), -Math.sin(rad), 0, 0, Math.sin(rad), Math.cos(rad), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

export function rotation(axis: Vec): Matrix {
    return multiply(multiply(rotationX(axis.x), rotationY(axis.y)), rotationZ(axis.z));
}

export function transform(transform: Transform) {
    return multiply(multiply(translation(transform.position), rotation(transform.rotation)), scale(transform.scale));
}

export function multiply(a: Matrix, b: Matrix): Matrix {
    return [
        b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12],
        b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13],
        b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14],
        b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15],

        b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12],
        b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13],
        b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14],
        b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15],

        b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12],
        b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13],
        b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14],
        b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15],

        b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12],
        b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13],
        b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14],
        b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15],
    ];
}

export function multiplyVec(mat: Matrix, vec: Vec): Vec {
    return new Vec([
        vec.x * mat[0] + vec.y * mat[4] + vec.z * mat[8] + vec.w * mat[12],
        vec.x * mat[1] + vec.y * mat[5] + vec.z * mat[9] + vec.w * mat[13],
        vec.x * mat[2] + vec.y * mat[6] + vec.z * mat[10] + vec.w * mat[14],
        vec.x * mat[3] + vec.y * mat[7] + vec.z * mat[11] + vec.w * mat[15],
    ]);
}

export function orthographic(
    left: number = -1,
    right: number = 1,
    top: number = -1,
    bottom: number = 1,
    near: number = 0,
    far: number = 100
): Matrix {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    return [-2 * lr, 0, 0, 0, 0, -2 * bt, 0, 0, 0, 0, 2 * nf, 0, (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1];
}

export function perspective(fov: number, near: number, far: number, aspect: number): Matrix {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    var rangeInv = 1.0 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (near + far) * rangeInv, -1, 0, 0, near * far * rangeInv * 2, 0];
}

export function inverse(mat: Matrix): Matrix {
    var inv: number[] = [];
    inv.length = mat.length;

    inv[0] =
        mat[9] * mat[14] * mat[7] -
        mat[13] * mat[10] * mat[7] +
        mat[13] * mat[6] * mat[11] -
        mat[5] * mat[14] * mat[11] -
        mat[9] * mat[6] * mat[15] +
        mat[5] * mat[10] * mat[15];
    inv[4] =
        mat[12] * mat[10] * mat[7] -
        mat[8] * mat[14] * mat[7] -
        mat[12] * mat[6] * mat[11] +
        mat[4] * mat[14] * mat[11] +
        mat[8] * mat[6] * mat[15] -
        mat[4] * mat[10] * mat[15];
    inv[8] =
        mat[8] * mat[13] * mat[7] -
        mat[12] * mat[9] * mat[7] +
        mat[12] * mat[5] * mat[11] -
        mat[4] * mat[13] * mat[11] -
        mat[8] * mat[5] * mat[15] +
        mat[4] * mat[9] * mat[15];
    inv[12] =
        mat[12] * mat[9] * mat[6] -
        mat[8] * mat[13] * mat[6] -
        mat[12] * mat[5] * mat[10] +
        mat[4] * mat[13] * mat[10] +
        mat[8] * mat[5] * mat[14] -
        mat[4] * mat[9] * mat[14];

    var det = mat[0] * inv[0] + mat[1] * inv[4] + mat[2] * inv[8] + mat[3] * inv[12];

    if (det == 0) throw new Error("determinant is zero??");

    var iDet = 1 / det;

    inv[0] *= iDet;
    inv[1] =
        (mat[13] * mat[10] * mat[3] -
            mat[9] * mat[14] * mat[3] -
            mat[13] * mat[2] * mat[11] +
            mat[1] * mat[14] * mat[11] +
            mat[9] * mat[2] * mat[15] -
            mat[1] * mat[10] * mat[15]) *
        iDet;
    inv[2] =
        (mat[5] * mat[14] * mat[3] -
            mat[13] * mat[6] * mat[3] +
            mat[13] * mat[2] * mat[7] -
            inv[1] * mat[14] * mat[7] -
            mat[5] * mat[2] * mat[15] +
            mat[1] * mat[6] * mat[15]) *
        iDet;
    inv[3] =
        (mat[9] * mat[6] * mat[3] -
            mat[5] * mat[10] * mat[3] -
            mat[9] * mat[2] * mat[7] +
            mat[1] * mat[10] * mat[7] +
            mat[5] * mat[2] * mat[11] -
            mat[1] * mat[6] * mat[11]) *
        iDet;

    inv[4] *= iDet;
    inv[5] =
        (mat[8] * mat[14] * mat[3] -
            mat[12] * mat[10] * mat[3] +
            mat[12] * mat[2] * mat[11] -
            mat[0] * mat[14] * mat[11] -
            mat[8] * mat[2] * mat[15] +
            mat[0] * mat[10] * mat[15]) *
        iDet;
    inv[6] =
        (mat[12] * mat[6] * mat[3] -
            mat[4] * mat[14] * mat[3] -
            mat[12] * mat[2] * mat[7] +
            mat[0] * mat[14] * mat[7] +
            mat[4] * mat[2] * mat[15] -
            mat[0] * mat[6] * mat[15]) *
        iDet;
    inv[7] =
        (mat[4] * mat[10] * mat[3] -
            mat[8] * mat[6] * mat[3] +
            mat[8] * mat[2] * mat[7] -
            mat[0] * mat[10] * mat[7] -
            mat[4] * mat[2] * mat[11] +
            mat[0] * mat[6] * mat[11]) *
        iDet;

    inv[8] *= iDet;
    inv[9] =
        (mat[12] * mat[9] * mat[3] -
            mat[8] * mat[13] * mat[3] -
            mat[12] * mat[1] * mat[11] +
            mat[0] * mat[13] * mat[11] +
            mat[8] * mat[1] * mat[15] -
            mat[0] * mat[9] * mat[15]) *
        iDet;
    inv[10] =
        (mat[4] * mat[13] * mat[3] -
            mat[12] * mat[5] * mat[3] +
            mat[12] * mat[1] * mat[7] -
            mat[0] * mat[13] * mat[7] -
            mat[4] * mat[1] * mat[15] +
            mat[0] * mat[5] * mat[15]) *
        iDet;
    inv[11] =
        (mat[8] * mat[5] * mat[3] -
            mat[4] * mat[9] * mat[3] -
            mat[8] * mat[1] * mat[7] +
            mat[0] * mat[9] * mat[7] +
            mat[4] * mat[1] * mat[11] -
            mat[0] * mat[5] * mat[11]) *
        iDet;

    inv[12] *= iDet;
    inv[13] =
        (mat[8] * mat[13] * mat[2] -
            mat[12] * mat[9] * mat[2] +
            mat[12] * mat[1] * mat[10] -
            mat[0] * mat[13] * mat[10] -
            mat[8] * mat[1] * mat[14] +
            mat[0] * mat[9] * mat[14]) *
        iDet;
    inv[14] =
        (mat[12] * mat[5] * mat[2] -
            mat[4] * mat[13] * mat[2] -
            mat[12] * mat[1] * mat[6] +
            mat[0] * mat[13] * mat[6] +
            mat[4] * mat[1] * mat[14] -
            mat[0] * mat[5] * mat[14]) *
        iDet;
    inv[15] =
        (mat[4] * mat[9] * mat[2] -
            mat[8] * mat[5] * mat[2] +
            mat[8] * mat[1] * mat[6] -
            mat[0] * mat[9] * mat[6] -
            mat[4] * mat[1] * mat[10] +
            mat[0] * mat[5] * mat[10]) *
        iDet;

    //@ts-ignore
    return inv;
}

export function worldToScreen(world: Matrix, view: Matrix, projection: Matrix, screenSize: Vec) {
    var m = multiply(world, multiply(view, projection));
    return Vec.from(m[12] / screenSize.x, m[13] / screenSize.y);
}

export function screenToWorld(screenPos: Vec, view: Matrix, projection: Matrix, screenSize: Vec) {
    let inv = inverse(multiply(projection, view));
    let v = multiplyVec(inv, Vec.from((2 * screenPos.x) / screenSize.x - 1, 1 - (2 * screenPos.y) / screenSize.y));
    return v;
}
