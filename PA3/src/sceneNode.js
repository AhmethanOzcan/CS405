/**
 * @class SceneNode
 * @desc A SceneNode is a node in the scene graph.
 * @property {MeshDrawer} meshDrawer - The MeshDrawer object to draw
 * @property {TRS} trs - The TRS object to transform the MeshDrawer
 * @property {SceneNode} parent - The parent node
 * @property {Array} children - The children nodes
 */

class SceneNode {
    constructor(meshDrawer, trs, parent = null) {
        this.meshDrawer = meshDrawer;
        this.trs = trs;
        this.parent = parent;
        this.children = [];

        if (parent) {
            this.parent.__addChild(this);
        }
    }

    __addChild(node) {
        this.children.push(node);
    }

    draw(mvp, modelView, normalMatrix, modelMatrix) {
        /**
         * @Task1 : Implement the draw function for the SceneNode class.
         */
        
        // Get the transformation matrix from this node's TRS object
        var transformationMatrix = this.trs.getTransformationMatrix();

        // Apply the transformation matrix to the passed matrices
        var transformedMvp = MatrixMult(mvp, transformationMatrix);
        var transformedModelView = MatrixMult(modelView, transformationMatrix);
        var transformedNormals = MatrixMult(normalMatrix, transformationMatrix);
        var transformedModel = MatrixMult(modelMatrix, transformationMatrix);

        // Draw the MeshDrawer with updated matrices
        if (this.meshDrawer) {
            this.meshDrawer.draw(transformedMvp, transformedModelView, transformedNormals, transformedModel);
        }

        // Recursively call draw on children nodes
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].draw(transformedMvp, transformedModelView, transformedNormals, transformedModel);
        }
    }

    

}