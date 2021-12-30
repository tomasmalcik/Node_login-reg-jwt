function Workspace(title, description, id) {
    return `<div class="col-lg-4">
    <div class="wrap">
      <div class="headline">
        <h5>${title}</h5>
      </div>
      <div class="w-content">
        <p class="description">${description}</p>
        <div class="actions">
        <i onclick="exportWorkspace('${id}')" class="fas fa-file-export"><div class="pop">Export this workspace</div></i>
          <i class="fas fa-pen"><div class="pop">Edit this workspace</div></i>
          <i onclick="showModal('${id}')"  class="far fa-trash-alt"><div class="pop">Scrap this workspace</div></i>
        </div>
      </div>
    </div>
  </div>`
}


