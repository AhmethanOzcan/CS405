function multiplyMatrices(matrixA, matrixB) {
    var result = [];

    for (var i = 0; i < 4; i++) {
        result[i] = [];
        for (var j = 0; j < 4; j++) {
            var sum = 0;
            for (var k = 0; k < 4; k++) {
                sum += matrixA[i * 4 + k] * matrixB[k * 4 + j];
            }
            result[i][j] = sum;
        }
    }

    // Flatten the result array
    return result.reduce((a, b) => a.concat(b), []);
}
function createIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}
function createScaleMatrix(scale_x, scale_y, scale_z) {
    return new Float32Array([
        scale_x, 0, 0, 0,
        0, scale_y, 0, 0,
        0, 0, scale_z, 0,
        0, 0, 0, 1
    ]);
}

function createTranslationMatrix(x_amount, y_amount, z_amount) {
    return new Float32Array([
        1, 0, 0, x_amount,
        0, 1, 0, y_amount,
        0, 0, 1, z_amount,
        0, 0, 0, 1
    ]);
}

function createRotationMatrix_Z(radian) {
    return new Float32Array([
        Math.cos(radian), -Math.sin(radian), 0, 0,
        Math.sin(radian), Math.cos(radian), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_X(radian) {
    return new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(radian), -Math.sin(radian), 0,
        0, Math.sin(radian), Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_Y(radian) {
    return new Float32Array([
        Math.cos(radian), 0, Math.sin(radian), 0,
        0, 1, 0, 0,
        -Math.sin(radian), 0, Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function getTransposeMatrix(matrix) {
    return new Float32Array([
        matrix[0], matrix[4], matrix[8], matrix[12],
        matrix[1], matrix[5], matrix[9], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[14],
        matrix[3], matrix[7], matrix[11], matrix[15]
    ]);
}

const vertexShaderSource = `
attribute vec3 position;
attribute vec3 normal; // Normal vector for lighting

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform vec3 lightDirection;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vNormal = vec3(normalMatrix * vec4(normal, 0.0));
    vLightDirection = lightDirection;

    gl_Position = vec4(position, 1.0) * projectionMatrix * modelViewMatrix; 
}

`

const fragmentShaderSource = `
precision mediump float;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vLightDirection);
    
    // Ambient component
    vec3 ambient = ambientColor;

    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * diffuseColor;

    // Specular component (view-dependent)
    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Assuming the view direction is along the z-axis
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * specularColor;

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}

`

/**
 * @WARNING DO NOT CHANGE ANYTHING ABOVE THIS LINE
 */



/**
 * 
 * @TASK1 Calculate the model view matrix by using the chatGPT
 */

function getChatGPTModelViewMatrix() {
    const transformationMatrix = new Float32Array([
        0.433, -0.25, 0.25, 0.3,
        0.612, 0.612, -0.612, -0.25,
        -0.657, 0.657, 0.371, 0,
        0, 0, 0, 1

    ]);
    return getTransposeMatrix(transformationMatrix);
}


/**
 * 
 * @TASK2 Calculate the model view matrix by using the given 
 * transformation methods and required transformation parameters
 * stated in transformation-prompt.txt
 */
function getModelViewMatrix() {
    // Define the transformation parameters
    const scale_x = 0.5, scale_y = 0.5, scale_z = 1;
    const translate_x = 0.3, translate_y = -0.25, translate_z = 0;
    const rotate_x_radian = Math.PI / 6; // 30 degrees
    const rotate_y_radian = Math.PI / 4; // 45 degrees
    const rotate_z_radian = Math.PI / 3; // 60 degrees

    const scaleMatrix = createScaleMatrix(scale_x, scale_y, scale_z);
    const translationMatrix = createTranslationMatrix(translate_x, translate_y, translate_z);
    const rotationXMatrix = createRotationMatrix_X(rotate_x_radian);
    const rotationYMatrix = createRotationMatrix_Y(rotate_y_radian);
    const rotationZMatrix = createRotationMatrix_Z(rotate_z_radian);

    let modelViewMatrix = createIdentityMatrix();
    modelViewMatrix = multiplyMatrices(modelViewMatrix, scaleMatrix);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationXMatrix);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationYMatrix);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationZMatrix);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, translationMatrix);

    return modelViewMatrix;
}

/**
 * 
 * @TASK3 Ask CHAT-GPT to animate the transformation calculated in 
 * task2 infinitely with a period of 10 seconds. 
 * First 5 seconds, the cube should transform from its initial 
 * position to the target position.
 * The next 5 seconds, the cube should return to its initial position.
 */
function getPeriodicMovement(startTime) {
    const currentTime = (Date.now() - startTime) / 1000; // Convert to seconds

    // Define the total animation duration (10 seconds)
    const animationDuration = 10;

    // Check if the animation is within the first 5 seconds
    if (currentTime < animationDuration / 2) {
        // Calculate the interpolation factor between 0 and 1
        const t = currentTime / (animationDuration / 2);

        // Interpolate between the initial and target transformations
        const initialMatrix = getModelViewMatrix(); // Get the initial transformation
        const targetMatrix = getChatGPTModelViewMatrix(); // Get the target transformation

        // Interpolate each element of the matrices and create the interpolated matrix
        const interpolatedMatrix = new Float32Array(16);
        for (let i = 0; i < 16; i++) {
            interpolatedMatrix[i] = initialMatrix[i] * (1 - t) + targetMatrix[i] * t;
        }

        return interpolatedMatrix;
    } else {
        // Calculate the time elapsed in the second half of the animation
        const elapsedTime = currentTime - (animationDuration / 2);

        // Check if the animation is still ongoing (within the 5-second return phase)
        if (elapsedTime < animationDuration / 2) {
            // Calculate the interpolation factor between 1 and 0
            const t = 1 - (elapsedTime / (animationDuration / 2));

            // Interpolate between the target and initial transformations to return to the initial position
            const initialMatrix = getModelViewMatrix(); // Get the initial transformation
            const targetMatrix = getChatGPTModelViewMatrix(); // Get the target transformation

            // Interpolate each element of the matrices and create the interpolated matrix
            const interpolatedMatrix = new Float32Array(16);
            for (let i = 0; i < 16; i++) {
                interpolatedMatrix[i] = targetMatrix[i] * (1 - t) + initialMatrix[i] * t;
            }

            return interpolatedMatrix;
        } else {
            // Animation has completed, return the final model view matrix
            return getModelViewMatrix(); // Return the initial position
        }
    }
}



