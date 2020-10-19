;; define variables
 (define-data-var positionIsOpen int 1)
 (define-data-var salary int 0)
 (define-data-var yearsOfExperience int 0)
;; apply method
(define-public (apply (preSalary int) (preYearsOfExperience int))
  (begin

    ;;(if (is-eq (var-get positionIsOpen) 0) 
      ;;(begin (print "no, position is closed!")
        ;;(ok false))
      ;;(begin (print "position is open!")))

    ;;(if (< (var-get preYearsOfExperience) 5) 
      ;;(begin (print "no, not enough years of experience!")
        ;;(ok false))
      ;;(begin (print "experience is fine, continue!")))

    ;;(if (> (var-get preSalary) 50) 
      ;;(begin (print "no, your salary is huge!")
        ;;(ok false))
      ;;(begin (print "salary is fine, you're hired!")))

    (var-set positionIsOpen 0)
    (var-set salary preSalary)
    (var-set yearsOfExperience preYearsOfExperience)
    (ok tx-sender)))
;; positionStatus getter
 (define-public (get-position-status)
   (ok (var-get positionIsOpen)))