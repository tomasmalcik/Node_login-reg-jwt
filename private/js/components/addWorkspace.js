function addWorkspace() {
    return `
            <div class="popup-content col-lg-4">
            <span class="close" onclick="hidePopup()">X</span>
            <h3>Add Workspace</h3>
            <form action="" method="POST">
                <div class="form-group">
                    <input type="text" class="form-control" name="workspace_name" id="workspace_name" />
                    <span class="highlight"></span>
                    <label for="email">Name of workspace</label>
                </div>
                <div class="form-group">
                    <button type="submit">Create Workspace</button>
                </div>
            </form>
        </div>
    `
}