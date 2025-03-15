	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 14, 0	sdk_version 14, 4
	.globl	_add_and_save                   ; -- Begin function add_and_save
	.p2align	2
_add_and_save:                          ; @add_and_save
	.cfi_startproc
; %bb.0:
	stp	x20, x19, [sp, #-32]!           ; 16-byte Folded Spill
	.cfi_def_cfa_offset 32
	stp	x29, x30, [sp, #16]             ; 16-byte Folded Spill
	add	x29, sp, #16
	.cfi_def_cfa w29, 16
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	.cfi_offset w19, -24
	.cfi_offset w20, -32
	mov	x19, x2
	bl	_add_two_numbers
	str	x0, [x19]
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	ldp	x20, x19, [sp], #32             ; 16-byte Folded Reload
	ret
	.cfi_endproc
                                        ; -- End function
	.globl	_demonstrate_suffixes           ; -- Begin function demonstrate_suffixes
	.p2align	2
_demonstrate_suffixes:                  ; @demonstrate_suffixes
	.cfi_startproc
; %bb.0:
	ret
	.cfi_endproc
                                        ; -- End function
	.globl	_demonstrate_promotion          ; -- Begin function demonstrate_promotion
	.p2align	2
_demonstrate_promotion:                 ; @demonstrate_promotion
	.cfi_startproc
; %bb.0:
	stp	x20, x19, [sp, #-32]!           ; 16-byte Folded Spill
	.cfi_def_cfa_offset 32
	stp	x29, x30, [sp, #16]             ; 16-byte Folded Spill
	add	x29, sp, #16
	.cfi_def_cfa w29, 16
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	.cfi_offset w19, -24
	.cfi_offset w20, -32
	mov	w0, #1
	mov	w1, #2
	bl	_add_chars
	mov	x19, x0
	mov	w0, #5
	mov	w1, #6
	bl	_add_chars
	mov	x20, x0
	mov	w0, #3
	mov	w1, #4
	bl	_add_shorts
	add	w8, w20, w19
	orr	w8, w0, w8
	sxtb	w0, w8
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	ldp	x20, x19, [sp], #32             ; 16-byte Folded Reload
	ret
	.cfi_endproc
                                        ; -- End function
	.globl	_array_on_stack                 ; -- Begin function array_on_stack
	.p2align	2
_array_on_stack:                        ; @array_on_stack
	.cfi_startproc
; %bb.0:
	sub	sp, sp, #160
	.cfi_def_cfa_offset 160
	stp	x29, x30, [sp, #144]            ; 16-byte Folded Spill
	add	x29, sp, #144
	.cfi_def_cfa w29, 16
	.cfi_offset w30, -8
	.cfi_offset w29, -16
Lloh0:
	adrp	x8, ___stack_chk_guard@GOTPAGE
Lloh1:
	ldr	x8, [x8, ___stack_chk_guard@GOTPAGEOFF]
Lloh2:
	ldr	x8, [x8]
	stur	x8, [x29, #-8]
	add	x8, sp, #8
	ldr	x0, [x8, x0, lsl #3]
	ldur	x8, [x29, #-8]
Lloh3:
	adrp	x9, ___stack_chk_guard@GOTPAGE
Lloh4:
	ldr	x9, [x9, ___stack_chk_guard@GOTPAGEOFF]
Lloh5:
	ldr	x9, [x9]
	cmp	x9, x8
	b.ne	LBB3_2
; %bb.1:
	ldp	x29, x30, [sp, #144]            ; 16-byte Folded Reload
	add	sp, sp, #160
	ret
LBB3_2:
	bl	___stack_chk_fail
	.loh AdrpLdrGotLdr	Lloh3, Lloh4, Lloh5
	.loh AdrpLdrGotLdr	Lloh0, Lloh1, Lloh2
	.cfi_endproc
                                        ; -- End function
	.globl	_access_global_array            ; -- Begin function access_global_array
	.p2align	2
_access_global_array:                   ; @access_global_array
	.cfi_startproc
; %bb.0:
Lloh6:
	adrp	x8, _global_array@GOTPAGE
Lloh7:
	ldr	x8, [x8, _global_array@GOTPAGEOFF]
	ldr	x0, [x8, x0, lsl #3]
	ret
	.loh AdrpLdrGot	Lloh6, Lloh7
	.cfi_endproc
                                        ; -- End function
	.globl	_swap                           ; -- Begin function swap
	.p2align	2
_swap:                                  ; @swap
	.cfi_startproc
; %bb.0:
	ldr	x8, [x0]
	ldr	x9, [x1]
	str	x9, [x0]
	str	x8, [x1]
	ret
	.cfi_endproc
                                        ; -- End function
	.globl	_hello_world                    ; -- Begin function hello_world
	.p2align	2
_hello_world:                           ; @hello_world
	.cfi_startproc
; %bb.0:
	sub	sp, sp, #48
	.cfi_def_cfa_offset 48
	stp	x29, x30, [sp, #32]             ; 16-byte Folded Spill
	add	x29, sp, #32
	.cfi_def_cfa w29, 16
	.cfi_offset w30, -8
	.cfi_offset w29, -16
Lloh8:
	adrp	x8, ___stack_chk_guard@GOTPAGE
Lloh9:
	ldr	x8, [x8, ___stack_chk_guard@GOTPAGEOFF]
Lloh10:
	ldr	x8, [x8]
	stur	x8, [x29, #-8]
Lloh11:
	adrp	x8, l___const.hello_world.hello@PAGE
Lloh12:
	add	x8, x8, l___const.hello_world.hello@PAGEOFF
	ldr	x9, [x8]
	str	x9, [sp, #8]
	ldur	x8, [x8, #6]
	stur	x8, [sp, #14]
	add	x0, sp, #8
	bl	_my_print
	ldur	x8, [x29, #-8]
Lloh13:
	adrp	x9, ___stack_chk_guard@GOTPAGE
Lloh14:
	ldr	x9, [x9, ___stack_chk_guard@GOTPAGEOFF]
Lloh15:
	ldr	x9, [x9]
	cmp	x9, x8
	b.ne	LBB6_2
; %bb.1:
	ldp	x29, x30, [sp, #32]             ; 16-byte Folded Reload
	add	sp, sp, #48
	ret
LBB6_2:
	bl	___stack_chk_fail
	.loh AdrpLdrGotLdr	Lloh13, Lloh14, Lloh15
	.loh AdrpAdd	Lloh11, Lloh12
	.loh AdrpLdrGotLdr	Lloh8, Lloh9, Lloh10
	.cfi_endproc
                                        ; -- End function
	.globl	_multiply_by_48                 ; -- Begin function multiply_by_48
	.p2align	2
_multiply_by_48:                        ; @multiply_by_48
	.cfi_startproc
; %bb.0:
	add	x8, x0, x0, lsl #1
	lsl	x0, x8, #4
	ret
	.cfi_endproc
                                        ; -- End function
	.globl	_my_add                         ; -- Begin function my_add
	.p2align	2
_my_add:                                ; @my_add
	.cfi_startproc
; %bb.0:
	add	x0, x1, x0
	ret
	.cfi_endproc
                                        ; -- End function
	.comm	_global_array,128,3             ; @global_array
	.section	__TEXT,__cstring,cstring_literals
l___const.hello_world.hello:            ; @__const.hello_world.hello
	.asciz	"Hello, World!"

.subsections_via_symbols
