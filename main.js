// ================= STRUCTURE =================

document.getElementById("st").addEventListener("change", function(){
  document.getElementById("structMsg").innerHTML =
    this.value === "other" ? "Other structures are not included" : "";
});

// ================= LOAD JSON =================

let locations = [];

fetch("locations.json")
.then(res => res.json())
.then(data => {
  locations = data;
  loadStates();
})
.catch(err => console.log(err));

// ================= LOAD STATES =================

function loadStates(){
  const stateSelect = document.getElementById("stateSelect");

  const states = [...new Set(locations.map(l => l.state))];

  states.forEach(s=>{
    let opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    stateSelect.appendChild(opt);
  });
}

// ================= LOAD DISTRICTS =================

document.getElementById("stateSelect").addEventListener("change", function(){

  const districtSelect = document.getElementById("districtSelect");
  districtSelect.innerHTML = `<option value="">--Select District--</option>`;

  const filtered = locations.filter(l => l.state === this.value);

  filtered.forEach(l=>{
    let opt = document.createElement("option");
    opt.value = l.district;
    opt.textContent = l.district;
    districtSelect.appendChild(opt);
  });

});

// ================= SHOW DETAILS =================

document.getElementById("districtSelect").addEventListener("change", function(){

  const state = document.getElementById("stateSelect").value;
  const district = this.value;

  const loc = locations.find(
    l => l.state === state && l.district === district
  );

  const div = document.getElementById("locationDetails");

  if(loc){
    div.innerHTML = `
      <p><b>State:</b> ${loc.state}</p>
      <p><b>District:</b> ${loc.district}</p>
      <p><b>Wind Speed:</b> ${loc.basic_wind_speed} m/s</p>
      <p><b>Seismic Zone:</b> ${loc.seismic_zone}</p>
      <p><b>Seismic Factor:</b> ${loc.seismic_factor}</p>
      <p><b>Max Temp:</b> ${loc.max_shade_air_temp} °C</p>
      <p><b>Min Temp:</b> ${loc.min_shade_air_temp} °C</p>
    `;

    modal.style.display="none";
  }
  else{
    div.innerHTML="No data found";
  }
});

// ================= GEOMETRIC VALIDATIONS =================

// Span Validation
document.getElementById("span").addEventListener("input", function(){
  const v = Number(this.value);
  const msg = document.getElementById("spanMsg");

  if(v && (v < 20 || v > 45)){
    msg.innerHTML = "Outside the software range.";
  }
  else{
    msg.innerHTML = "";
  }
});

// Carriageway Width Validation
document.getElementById("width").addEventListener("input", function(){
  const v = Number(this.value);
  const msg = document.getElementById("widthMsg");

  if(v && (v < 4.25 || v >= 24)){
    msg.innerHTML = "Must be ≥ 4.25 m and < 24 m";
  }
  else{
    msg.innerHTML = "";
  }
});

// Skew Angle Validation
document.getElementById("skew").addEventListener("input", function(){
  const v = Number(this.value);
  const msg = document.getElementById("skewMsg");

  if(v && (v < -15 || v > 15)){
    msg.innerHTML = "IRC 24 (2010) requires detailed analysis";
  }
  else{
    msg.innerHTML = "";
  }
});

// ========== MODIFY ADDITIONAL GEOMETRY ==========

const geoModal = document.getElementById("geometryModal");
const openGeoBtn = document.getElementById("openGeoBtn");
const closeGeo = document.getElementById("closeGeo");

openGeoBtn.onclick = () => {
  geoModal.style.display = "block";
};

closeGeo.onclick = () => {
  geoModal.style.display = "none";
};

const spacing = document.getElementById("gSpacing");
const girders = document.getElementById("gCount");
const overhang = document.getElementById("gOverhang");
const geoError = document.getElementById("geoError");

function updateGeometry(changed){

  const width = Number(document.getElementById("width").value);

  if(!width){
    geoError.innerHTML = "Enter Carriageway Width first";
    return;
  }

  const overall = width + 5;

  let s = Number(spacing.value);
  let g = Number(girders.value);
  let o = Number(overhang.value);

  if(changed==="spacing" && s>0 && o>0){
    girders.value = Math.round((overall - o)/s);
  }

  if(changed==="girders" && g>0 && o>0){
    spacing.value = ((overall - o)/g).toFixed(1);
  }

  if(changed==="overhang" && g>0){
    spacing.value = ((overall - o)/g).toFixed(1);
  }

  if(s >= overall || o >= overall){
    geoError.innerHTML =
      "Spacing & Overhang must be less than Overall Width ("+overall+" m)";
  }
  else{
    geoError.innerHTML="";
  }
}

spacing.oninput = ()=>updateGeometry("spacing");
girders.oninput = ()=>updateGeometry("girders");
overhang.oninput = ()=>updateGeometry("overhang");

document.getElementById("saveGeoBtn").onclick = ()=>{

  if(spacing.value=="" || girders.value=="" || overhang.value==""){
    geoError.innerHTML="Fill all fields";
    return;
  }

  geoModal.style.display="none";
  alert("Additional Geometry Saved");
};


// ================= MODAL =================

const modal = document.getElementById("locationModal");

document.getElementById("openLocationBtn").onclick = ()=>{
  modal.style.display="block";
};

document.querySelector(".close").onclick = ()=>{
  modal.style.display="none";
};

window.onclick = e =>{
  if(e.target === modal) modal.style.display="none";
};

// ================= PANEL TOGGLE =================

function togglePanel(id,header){
  let p=document.getElementById(id);
  let arrow=header.querySelector(".arrow");

  if(p.style.display==="block"){
    p.style.display="none";
    p.style.maxHeight=null;
    arrow.innerHTML=">";
  }
  else{
    p.style.display="block";
    p.style.maxHeight=p.scrollHeight+"px";
    arrow.innerHTML="<";
  }
}

// ================= SUBMIT =================

function submitData(){
  let width=document.getElementById("width").value;
  let span=document.getElementById("span").value;

  if(width==""||span=="")
    alert("Please fill all fields");
  else
    alert("Bridge Data Saved");
}

function popUp(){
  alert("Features will be enabled later.");
}

// ================= CUSTOM TABLE FEATURE =================

const customCheck = document.getElementById("customCheck");
const openTableBtn = document.getElementById("openTableBtn");

const tableModal = document.getElementById("tableModal");
const closeTable = document.getElementById("closeTable");
const saveCustomBtn = document.getElementById("saveCustomBtn");

// Enable button when checkbox checked
customCheck.addEventListener("change", function(){
  openTableBtn.disabled = !this.checked;
});

// Open table
openTableBtn.onclick = () =>{
  tableModal.style.display = "block";
};

// Close table
closeTable.onclick = () =>{
  tableModal.style.display = "none";
};

// Save custom values
saveCustomBtn.onclick = () =>{

  const wind = document.getElementById("cWind").value;
  const zone = document.getElementById("cZone").value;
  const factor = document.getElementById("cFactor").value;
  const maxT = document.getElementById("cMax").value;
  const minT = document.getElementById("cMin").value;

  if(wind=="" || zone=="" || factor=="" || maxT=="" || minT==""){
    alert("Please fill all values");
    return;
  }

  document.getElementById("locationDetails").innerHTML = `
    <p><b>Basic Wind Speed:</b> ${wind} m/s</p>
    <p><b>Seismic Zone:</b> ${zone}</p>
    <p><b>Seismic Factor:</b> ${factor}</p>
    <p><b>Max Shade Temp:</b> ${maxT} °C</p>
    <p><b>Min Shade Temp:</b> ${minT} °C</p>
    <p style="color:green"><b>Source:</b> Custom Input</p>
  `;

  tableModal.style.display="none";
  modal.style.display="none"; // close location modal
};
