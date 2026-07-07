package com.flycart.backend.service;

import com.flycart.backend.dto.ProductDtos;
import com.flycart.backend.exception.ApiException;
import com.flycart.backend.model.Product;
import com.flycart.backend.repository.ProductRepository;
import com.flycart.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(ProductRepository productRepository, ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ProductDtos.ProductResponse> search(String category, String term, String sort) {
        String safeCategory = (category == null || category.isBlank()) ? "All" : category;
        String safeTerm = (term == null) ? "" : term.trim().toLowerCase();

        List<Product> results = productRepository.search(safeCategory, safeTerm);

        Comparator<Product> comparator = switch (sort == null ? "" : sort) {
            case "price-asc" -> Comparator.comparing(Product::getPrice);
            case "price-desc" -> Comparator.comparing(Product::getPrice).reversed();
            case "rating" -> Comparator.comparing(Product::getRating).reversed();
            default -> null;
        };
        if (comparator != null) {
            results = results.stream().sorted(comparator).toList();
        }

        return results.stream().map(this::toResponse).toList();
    }

    public ProductDtos.ProductResponse getById(Long id) {
        Product product = findEntity(id);
        return toResponse(product);
    }

    public Product findEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product " + id + " was not found."));
    }

    public List<ProductDtos.ProductResponse> getFeatured() {
        return productRepository.findAll().stream()
                .filter(p -> p.getTags().contains("bestseller"))
                .limit(4)
                .map(this::toResponse)
                .toList();
    }

    public List<ProductDtos.ProductResponse> getRelated(Long id) {
        Product product = findEntity(id);
        return productRepository.findByCategoryAndIdNot(product.getCategory(), id).stream()
                .limit(4)
                .map(this::toResponse)
                .toList();
    }

    public List<ProductDtos.ReviewResponse> getReviews(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(r -> new ProductDtos.ReviewResponse(r.getId(), productId, r.getAuthor(), r.getRating(), r.getComment(), r.getDate()))
                .toList();
    }

    private ProductDtos.ProductResponse toResponse(Product p) {
        return new ProductDtos.ProductResponse(
                p.getId(), p.getName(), p.getCategory(), p.getPrice(), p.getMrp(), p.getImage(),
                p.getRating(), p.getReviewCount(), p.getDescription(), p.getStock(),
                p.getHighlights(), p.getTags()
        );
    }
}
