//inputs
var bookmarkNameInput = document.getElementById("bookmark-name");
var bookmarkSiteInput = document.getElementById("site-url");
var searchInput = document.getElementById("search-input");
var errorSection = document.querySelector(".error-section");

//table body
var tableBodyElement = document.getElementById("bookmarktable-body");

//variables
var bookmarks ;
if(localStorage.getItem("bookmarks") != null){
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    displayData();
}
else{
    bookmarks = [];
}

var editedIndex ;

//buttons
var submitBtn = document.getElementById("submit-btn");
var closeErrorMsgIco = document.querySelector(".close i");
var editBtn = document.getElementById("edit-btn");


//events
submitBtn.addEventListener("click",function(){
    submitData();
});

bookmarkNameInput.addEventListener("input",function(){
    validateName();
});

bookmarkSiteInput.addEventListener("input", function(){
    validateSiteURL();
});

closeErrorMsgIco.addEventListener("click",function(){
    closeErrorMsg();
});

document.addEventListener("click",function(e){
    if(e.target.id === "error-section"){
        closeErrorMsg();
    }
});

editBtn.addEventListener("click", function(){
    updateBookmark();
});

searchInput.addEventListener("input", function(){
    displayData();
});



//submit data to data table
function submitData(){
    if(validateName() && validateSiteURL() && validateUniqueName()){
        var bookmark = {
            name:bookmarkNameInput.value,
            site:bookmarkSiteInput.value
        }

        bookmarks.push(bookmark);
        setLocalStorageData();
        displayData();
        clearInputs();

    } else {
        errorSection.classList.replace("d-none", "d-flex");
    }
}

function displayData(){
    var displayElements = "";
    for (var i=0; i<bookmarks.length ; i++){
        if(bookmarks[i].name.toLowerCase().includes(searchInput.value.toLowerCase())){
            displayElements += `<tr>
            <td>${i+1}</th>
            <td>${bookmarks[i].name}</td>
            <td><a class="btn px-2" id="visit-btn" href="${bookmarks[i].site}" target="_blank"><i class="fa-solid fa-eye"></i> Visit</a></td>                    
            <td><button type="button" data-index="${i}" class="btn update-btn btn-warning"><i class="fa-solid fa-pen-to-square"></i> Update</button></td>
            <td><button type="button"  data-index="${i}" class="btn delete-btn btn-danger"><i class="fa-solid fa-trash-can"></i> Delete</button></td>
          </tr>`
        }

    }

    tableBodyElement.innerHTML = displayElements;

    var deleteBtns = document.querySelectorAll(".delete-btn");
    var updateBtns = document.querySelectorAll(".update-btn");
    for(var i=0; i<deleteBtns.length; i++){
        deleteBtns[i].addEventListener("click", function(){
            const index = this.getAttribute("data-index");
            deleteBookmark(index);
        });

        updateBtns[i].addEventListener("click",function(){
            const index = this.getAttribute("data-index");
            setFormWithBookmark(index);
        })
    }
}


//validata Name field
function validateName(){
    var regexName = /^[A-Za-z0-9]{3,}(\s+\w+)*$/
    if(regexName.test(bookmarkNameInput.value)){
        bookmarkNameInput.classList.add("is-valid");
        bookmarkNameInput.classList.remove("is-invalid");
        return true;
    }
    else{
        bookmarkNameInput.classList.add("is-invalid");
        bookmarkNameInput.classList.remove("is-valid");
        return false;
    }

}

//validata site url field
function validateSiteURL(){
    var regexSite = /^https?:\/\/[^\s/$.?#].[^\s]*$/
    if(regexSite.test(bookmarkSiteInput.value)){
        bookmarkSiteInput.classList.add("is-valid");
        bookmarkSiteInput.classList.remove("is-invalid");
        return true;
    }
    else{
        bookmarkSiteInput.classList.add("is-invalid");
        bookmarkSiteInput.classList.remove("is-valid");
        return false;
    }

}

//set localstorage with bookmarks data
function setLocalStorageData(){
    localStorage.setItem("bookmarks",JSON.stringify(bookmarks));
}

function closeErrorMsg(){
    errorSection.classList.replace("d-flex", "d-none");
}

function clearInputs(){
    bookmarkNameInput.value = "";
    bookmarkNameInput.classList.remove("is-valid");
    bookmarkNameInput.classList.remove("is-invalid");
    bookmarkSiteInput.value = "";
    bookmarkSiteInput.classList.remove("is-valid");
    bookmarkSiteInput.classList.remove("is-invalid");
}

//delete this bookmark
function deleteBookmark(index){
    bookmarks.splice(index,1);
    displayData();
    setLocalStorageData();
}

//set input with the data of this bookmark
function setFormWithBookmark(index){
    editedIndex = index;
    bookmarkNameInput.value = bookmarks[index].name;
    bookmarkSiteInput.value  = bookmarks[index].site;

    submitBtn.classList.add("d-none");
    editBtn.classList.remove("d-none");
}

//update bookmark with the new data
function updateBookmark(){
    if(validateName() && validateSiteURL()){
        bookmarks[editedIndex].name = bookmarkNameInput.value;
        bookmarks[editedIndex].site = bookmarkSiteInput.value;
    
        displayData();
        setLocalStorageData();
        clearInputs();
    
        submitBtn.classList.remove("d-none");
        editBtn.classList.add("d-none");
    } else{
        errorSection.classList.replace("d-none", "d-flex");
    }

}


function validateUniqueName(){
    for(var i=0; i<bookmarks.length; i++){
        if(bookmarkNameInput.value.toLowerCase() === bookmarks[i].name.toLowerCase()){
            alert("This name already entered!");
            bookmarkNameInput.classList.add("is-invalid");
            bookmarkNameInput.classList.remove("is-valid");
            return false;
        }
    }

    return true;
}