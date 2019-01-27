<template>
  <div class="hello">
    <div>
      <div>New Device</div>
      <input type="text" ref = "device"></input>
      <div>Latitude</div>
      <input type="number" ref = "latitude"></input>
      <div>Longitude</div>
      <input type="number" ref = "longitude"></input>
      <div>Set Time</div>
      <input type="number" ref = "set_time"></input>
      <button v-on:click="postDevice()">Submit</button>
    </div>
    <div>
      <div>Device Name</div>
      <select ref = "name">
        <option v-for="device in fml_data" :value = "device.name" >{{device.name}}</option>
      </select>
      <div>Type</div>
      <select ref = "type">
        <option value = "Current_State">Current_State</option>
        <option value = "Diagnostic_Reporte">Diagnostic_Report</option>
        <option value = "Engine Idle_End">Engine Idle_End</option>
        <option value = "Trip_End">Trip_End</option>
        <option value = "Trip_Start">Trip_Start</option>
        <option value = "Heading">Heading</option>
        <option value = "NoMove">NoMove</option>
        <option value = "NoMoveTimeout">NoMoveTimeout</option>
        <option value = "ServiceStart">ServiceStart</option>
        <option value = "StartedMove">StartedMove</option>
        <option value = "TimeExpired1">TimeExpired1</option>
        <option value = "QuickAcceleration">QuickAcceleration</option>
        <option value = "SharpDirectionChange">SharpDirectionChange</option>
        <option value = "SuddenBrake">SuddenBrake</option>
        <option value = "N_A">N_A</option>
      </select>
      <div>Time</div>
      <input type="number" ref = "time"></input>
      <div>Latitude</div>
      <input type="number" ref = "lat"></input>
      <div>Longitude</div>
      <input type="number" ref = "long"></input>
      <button v-on:click="newInput()">Update</button>
    </div>
    <div v-if="trouble">{{trouble_device}} may be stolen</div>

    </div>
  </div>
</template>

<script>
import {HTTP} from '@/components/app-common';
export default {
  name: 'HelloWorld',
  data: function () {
    return {
      fml_data: {},
      trouble: false,
      trouble_device: ""
    }
  },
  methods: {
    getDevices: function() {
      var output = {};
      var _this = this;
      HTTP.get(`check`)
    .then(response => {
      console.log(response.data);
      _this.fml_data = response.data;
      output = response.data;
    })
    .catch(e => {
      _this.errors.push(e)
    })
    return output;
    },
    postDevice: function() {
      var output = {};
      var _this = this;
      HTTP.post(`newDevice`, {
        "device": _this.$refs.device.value,
        "time": _this.$refs.set_time.value,
        "lat": _this.$refs.latitude.value,
        "long": _this.$refs.longitude.value
      })
    .then(response => {
      console.log(response.data);
      _this.fml_data = response.data;
    })
    .catch(e => {
      _this.errors.push(e)
    })
    },
    newInput: function() {
      var output = {};
      var _this = this;
      HTTP.post(`check/` + _this.$refs.name.value, {
        "device": _this.$refs.name.value,
        "type": _this.$refs.type.value,
        "time": _this.$refs.time.value,
        "lat": _this.$refs.lat.value,
        "long": _this.$refs.long.value
      })
    .then(response => {
      console.log(response.data);
      output = response.data;
    })
    .catch(e => {
      _this.errors.push(e)
    })
    if(output.onTrack == false){
      this.trouble = true;
      this.trouble_device = this.$refs.name.value;
    }
    }
  },
  mounted: function(){
    this.getDevices();
  }
}
</script>

<style>
</style>
