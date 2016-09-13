/// <reference path="../typings/index.d.ts" />

import { VM } from "../vm";
import { Compiler } from "../compiler";
import { run, inspectLast } from "./helpers";


describe("Default instructions", function() {
  it("has a NOOP instruction", () => {
    let vm = run("nooP Noop NOOP");
    let startIP = vm.IP;
    vm.tick();
    vm.tick();
    vm.tick();
    let endIP = vm.IP;
    expect(endIP).toEqual(startIP + 3,
    "A NOOP instruction should increment the instruction pointer each time it is called.");
    expect(vm.PSP).toEqual(vm.END_ADDRESS,
    "The NOOP instruction has no stack effect.");
  });

  it("has a PUSH instruction", function() {
    let vm = run("PUSH 1 pUsH 2 PUsh 3");
    vm.tick();
    vm.tick();
    vm.tick();
    expect(vm.END_ADDRESS).toBeGreaterThan(vm.PSP);
    expect(vm.PSP).toEqual(vm.END_ADDRESS - 3);
    expect(vm.buffer[vm.END_ADDRESS]).toEqual(
      1,
      "I pushed 1 onto the stack. Therefore, I expected one to be the element at the bottom of the stack.");
    expect(vm.buffer[vm.PSP]).toEqual(0,
      "Stack pointer should point to the next available stack slot.");
    expect(vm.buffer[vm.PSP + 1]).toEqual(3,
      "Expected last PUSHed value to be one address under stack pointer.");
  });

  it("has a STORE instruction", () => {
    let vm = run(`
    push 12
    push 34
    store
    `);
    let startIP = vm.IP;
    let startPSP = vm.PSP;
    inspectLast(10, vm);
    vm.tick();
    vm.tick();
    vm.tick();
    let endIP = vm.IP;
    let endPSP = vm.PSP;
    expect(startPSP).toEqual(vm.END_ADDRESS);
    inspectLast(10, vm);
    expect(endIP).toEqual((startIP + 5),
    "Push increments the stack 2x. Store 1x. Push + push + store = 5 IP incrementations.");
    console.log(vm.buffer)
    expect(vm.PSP).toEqual(vm.END_ADDRESS,
    "The STORE instruction should clear the last two stack items.");
  });

})
