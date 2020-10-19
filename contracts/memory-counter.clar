;; define memory-counter variable
 (define-data-var memory-counter int 0)
;; un-double method
(define-public (un-double)
  (begin
    (if (is-eq (var-get memory-counter) 0)
      (var-set memory-counter 1)
      (var-set memory-counter (* (var-get memory-counter) 2)))
    (ok (var-get memory-counter))))
;; do-double method
(define-public (do-double)
  (begin
    (asserts! (> (var-get memory-counter) 0) (err 1))
    (if (is-eq (var-get memory-counter) 1)
      (var-set memory-counter 0)
      (var-set memory-counter (/ (var-get memory-counter) 2)))
    (ok (var-get memory-counter))))
;; memory-counter getter
 (define-public (get-memory-counter)
   (ok (var-get memory-counter)))
;; memory-counter setter
 (define-public (set-memory-counter (new-count int))
  (begin
   (asserts! (> new-count 0) (err -1))
   (ok (var-set memory-counter new-count))))